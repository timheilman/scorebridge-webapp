import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { SyntheticEvent } from "react";

import { AddClubInput, MutationAddClubArgs } from "../../appsync";
import { mutationAddClub } from "../graphql/mutations";
import requiredEnvVar from "../requiredEnvVar";

const addClub = async (
  newAdminEmail = "tdh+testing-hardcoded-add-club-creds@stanfordalumni.org",
  newClubName = "testing-hardcoded-add-club-creds name",
) => {
  const myMutationObj: AddClubInput = {
    newAdminEmail,
    newClubName,
    suppressInvitationEmail: false,
  };

  const myMutationArgs: MutationAddClubArgs = { input: myMutationObj };
  /* create a new club */
  await API.graphql<GraphQLQuery<AddClubInput>>(
    {
      ...graphqlOperation(mutationAddClub, myMutationArgs),
      authMode: "API_KEY",
    },
    // TODO: try removing this line; I think it is a red herring
    { Authorization: requiredEnvVar("ADD_CLUB_API_KEY") },
  );
};

const handleSubmit = (event: SyntheticEvent) => {
  event.preventDefault(); // we are taking over, in react, from browser event handling here
  console.log("in handleSubmit");
  addClub()
    .then(() => {
      console.log("Add club success");
    })
    .catch((reason) => console.error("add club problem", reason));
  console.log("exiting handleSubmit after promise invocation");
};

export default function HomePage() {
  return (
    <>
      <h2>HomePage</h2>
      <form className="input-group vertical" onSubmit={handleSubmit}>
        <button>click me</button>
      </form>
    </>
  );
}
