import gql from "graphql-tag";

export const mutationAddClub = gql`
  mutation addClub($input: AddClubInput!) {
    addClub(input: $input) {
      data {
        clubId
        userId
      }
      errors {
        message
      }
    }
  }
`;
