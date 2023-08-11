import gql from "graphql-tag";

export const mutationAddClub = gql`
  mutation addClub($input: AddClubInput!) {
    addClub(input: $input) {
      clubId
      userId
    }
  }
`;

export const mutationUnexpectedError = gql`
  mutation unexpectedError {
    unexpectedError {
      neverGetsReturned
    }
  }
`;
