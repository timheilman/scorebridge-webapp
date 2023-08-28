import gql from "graphql-tag";

export const mutationCreateClub = gql`
  mutation createClub($input: CreateClubInput!) {
    createClub(input: $input) {
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

export const mutationRemoveClubAndAdmin = gql`
  mutation removeClubAndAdmin($input: RemoveClubAndAdminInput!) {
    removeClubAndAdmin(input: $input) {
      status
    }
  }
`;
