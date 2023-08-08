import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { ChangeEvent, SyntheticEvent, useState } from "react";

import { AddClubInput, MutationAddClubArgs } from "../../../appsync";
import { mutationAddClub } from "../../graphql/mutations";

const addClub = async (newAdminEmail: string, newClubName: string) => {
  // TODO: verify these now-user inputs!
  const myMutationObj: AddClubInput = {
    newAdminEmail,
    newClubName,
    suppressInvitationEmail: false,
  };

  const myMutationArgs: MutationAddClubArgs = { input: myMutationObj };
  /* create a new club */
  await API.graphql<GraphQLQuery<AddClubInput>>({
    ...graphqlOperation(mutationAddClub, myMutationArgs),
    authMode: "API_KEY",
  });
};

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [submitPressed, setSubmitPressed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setSubmitPressed(true);
    console.log("in handleSubmit");
    addClub(email, clubName)
      .then(() => {
        setEmailSent(true);
        console.log("Add club success");
      })
      .catch((reason) => {
        console.error("add club problem", reason);
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
    <>
      <h2>Sign Up to administer your club&apos;s duplicate bridge games:</h2>
      {submitPressed ? (
        emailSent ? (
          <p>email sent!</p>
        ) : (
          <p>sending email...</p>
        )
      ) : (
        <form className="input-group vertical" onSubmit={handleSubmit}>
          <p>Email address:</p>
          <input type="text" value={email} onChange={handleChangeEmail} />
          <p>Club&apos;s name:</p>
          <input type="text" value={clubName} onChange={handleChangeName} />
          <button>Send me an email</button>
        </form>
      )}
    </>
  );
}
