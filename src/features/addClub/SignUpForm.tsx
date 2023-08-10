import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { ChangeEvent, SyntheticEvent, useState } from "react";

import { AddClubResponse, MutationAddClubArgs } from "../../../appsync";
import { mutationAddClub } from "../../graphql/mutations";

const addClub = async (newAdminEmail: string, newClubName: string) => {
  // TODO: verify these now-user inputs!
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
    authMode: "API_KEY",
  });
};
interface AfterSubmitElementProps {
  addClubDone: boolean;
  addClubError: string;
}
function AfterSubmitElement({
  addClubDone,
  addClubError,
}: AfterSubmitElementProps) {
  if (!addClubDone) {
    return <p>sending email...</p>;
  }
  if (addClubError) {
    return <p>{addClubError}</p>;
  } else {
    return <p>email sent!</p>;
  }
}

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [submitPressed, setSubmitPressed] = useState(false);
  const [addClubDone, setAddClubDone] = useState(false);
  const [addClubError, setAddClubError] = useState("");
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setSubmitPressed(true);
    console.log("in handleSubmit");
    addClub(email, clubName)
      .then((result) => {
        setAddClubDone(true);
        console.log(`Add club success: ${JSON.stringify(result, null, 2)}`);
      })
      .catch(
        (reason: { errors?: { errorType: string; message: string }[] }) => {
          setAddClubDone(true);
          if (
            reason.errors &&
            Array.isArray(reason.errors) &&
            reason.errors.length > 0 &&
            reason.errors[0]?.errorType === "UserAlreadyExistsError"
          ) {
            setAddClubError(reason.errors[0].message);
          } else if (process.env.REACT_APP_STAGE !== "prod") {
            setAddClubError(JSON.stringify(reason, null, 2));
          } else {
            setAddClubError(
              "There was a problem signing you up.\nPlease see the developer console of your browser for more information.\nPerhaps try again later.",
            );
          }
          console.error("add club problem", reason);
        },
      );
    console.log("exiting handleSubmit after promise invocation");
  };
  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setClubName(event.target.value);
  };

  return (
    <>
      <h2>Sign Up to administer your club&apos;s duplicate bridge games:</h2>
      {submitPressed ? (
        AfterSubmitElement({ addClubDone, addClubError })
      ) : (
        <form className="input-group vertical" onSubmit={handleSubmit}>
          <p>Email address:</p>
          <input
            type="text"
            value={email}
            onChange={handleChangeEmail}
            data-test-id="formAddClubEmailAddress"
          />
          <p>Club&apos;s name:</p>
          <input
            type="text"
            value={clubName}
            onChange={handleChangeName}
            data-test-id="formAddClubClubName"
          />
          <button data-test-id="formAddClubSubmit">Send me an email</button>
        </form>
      )}
    </>
  );
}
