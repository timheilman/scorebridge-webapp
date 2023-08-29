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

export const mutationDeleteClubAndAdmin = gql`
  mutation deleteClubAndAdmin($input: DeleteClubAndAdminInput!) {
    deleteClubAndAdmin(input: $input) {
      status
    }
  }
`;

export const queryListClubDevices = gql`
  query createClub($input: ListClubDevicesInput!) {
    listClubDevices(input: $input) {
      clubDevices {
        clubId
        clubDeviceId
        name
        createdAt
        updatedAt
      }
    }
  }
`;
