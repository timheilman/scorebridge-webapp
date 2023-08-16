import { GraphQLQuery } from "@aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";
import { ChangeEvent, SyntheticEvent, useState } from "react";

import { AddClubResponse, MutationAddClubArgs } from "../../../appsync";
import { mutationAddClub } from "../../graphql/mutations";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from "./SignUpForm.module.css";
const addClub = async (
  newAdminEmail: string,
  newClubName: string,
  authenticated: boolean,
) => {
  const myMutationArgs: MutationAddClubArgs = {
    input: {
      newAdminEmail,
      newClubName,
      suppressInvitationEmail: false,
    },
  };
  /* create a new club */
  return API.graphql<GraphQLQuery<AddClubResponse>>({
    ...graphqlOperation(mutationAddClub, myMutationArgs),
    ...(authenticated ? {} : { authMode: "API_KEY" }),
  });
};

interface MaybeErrorElementParams {
  submitInFlight: boolean;
  everSubmitted: boolean;
  addClubError: string | null;
}
function maybeFooterElement({
  addClubError,
  submitInFlight,
  everSubmitted,
}: MaybeErrorElementParams) {
  if (submitInFlight) {
    return <div>sending email...</div>;
  }
  if (addClubError) {
    return (
      <div>
        Problem with last submission: <pre>{addClubError}</pre>
      </div>
    );
  }
  if (everSubmitted) {
    return <div>email sent!</div>;
  }
}

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [addClubError, setAddClubError] = useState<string | null>(null);

  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */
  function handleExpectedGqlReject(errors: Array<any>) {
    setAddClubError(
      errors
        .map((error) => {
          if (error.message) {
            if (error.errorType) {
              return `ErrorType: ${error.errorType}; Message: ${error.message}`;
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return error.message;
            }
          } else {
            return JSON.stringify(error);
          }
        })
        .join("\n"),
    );
  }

  function handleGqlReject(reason: any) {
    if (reason.errors && Array.isArray(reason.errors)) {
      handleExpectedGqlReject(reason.errors as Array<unknown>);
    } else {
      console.error(`unexpected form of error`, reason);
      setAddClubError(JSON.stringify(reason, null, 2));
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setEverSubmitted(true);
    setSubmitInFlight(true);
    console.log("in handleSubmit");
    addClub(email, clubName, authStatus === "authenticated")
      .then((result) => {
        setAddClubError(null);
        setSubmitInFlight(false);
        console.log(`Add club success: ${JSON.stringify(result, null, 2)}`);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((reason: any) => {
        console.error("Promise rejected: GQL Mutation.AddClub", reason);
        handleGqlReject(reason);
        setSubmitInFlight(false);
      });
    console.log("exiting handleSubmit after promise invocation");
  };
  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setClubName(event.target.value);
  };

  return (
    <div>
      <form className="input-group vertical" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            Sign Up to administer your club&apos;s duplicate bridge games
          </legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label htmlFor="email">Email address</label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="email"
                placeholder="email"
                onChange={handleChangeEmail}
                data-test-id="formAddClubEmailAddress"
              />
            </div>
            <div className="col-sm-12 col-md-6">
              <label htmlFor="clubName">Club&apos;s name:</label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="clubName"
                placeholder="My Bridge Club"
                onChange={handleChangeName}
                data-test-id="formAddClubClubName"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              <button
                disabled={submitInFlight}
                className="primary"
                data-test-id="formAddClubSubmit"
              >
                Send me an email
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      {maybeFooterElement({ everSubmitted, submitInFlight, addClubError })}
    </div>
  );
}
