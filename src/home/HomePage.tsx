import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";
import { SyntheticEvent } from "react";

import { AddClubInput, MutationAddClubArgs } from "../../appsync";
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
  const libraryQuery = gql`
    mutation addClub($input: AddClubInput!) {
      addClub(input: $input) {
        newClubId
        newUserId
      }
    }
  `;
  await API.graphql<GraphQLQuery<AddClubInput>>(
    {
      ...graphqlOperation(libraryQuery, myMutationArgs),
      authMode: "API_KEY",
    },
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
