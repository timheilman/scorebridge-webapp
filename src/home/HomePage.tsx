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
    graphqlOperation(libraryQuery, myMutationArgs),
    {
      aws_appsync_apiKey: requiredEnvVar("ADD_CLUB_API_KEY"),
    },
  );
};

const handleSubmit = (event: SyntheticEvent) => {
  event.preventDefault(); // we are taking over, in react, from browser event handling here
  addClub()
    .then(() => {
      console.log("Add club success");
    })
    .catch((reason) => console.error("add club problem", reason));
};

export default function HomePage() {
  return (
    <>
      <h2>HomePage</h2>
      <button onSubmit={handleSubmit}>click me</button>
    </>
  );
}
