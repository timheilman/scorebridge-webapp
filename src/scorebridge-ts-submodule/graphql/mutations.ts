import gql from "graphql-tag";
export const mutationCreateClub = gql`
  mutation createClub($input: CreateClubInput!) {
    createClub(input: $input) {
      clubId
      userId
    }
  }
`;

export const mutationUpdateClub = gql`
  mutation updateClub($input: UpdateClubInput!) {
    updateClub(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const mutationCreateClubDevice = gql`
  mutation createClubDevice($input: CreateClubDeviceInput!) {
    createClubDevice(input: $input) {
      clubId
      clubDeviceId
      name
      email
      createdAt
      updatedAt
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

export const mutationDeleteClubDevice = gql`
  mutation deleteClubDevice($input: DeleteClubDeviceInput!) {
    deleteClubDevice(input: $input) {
      clubId
      clubDeviceId
      name
      email
      createdAt
      updatedAt
    }
  }
`;
export const queryListClubDevices = gql`
  query listClubDevices($input: ListClubDevicesInput!) {
    listClubDevices(input: $input) {
      clubDevices {
        clubId
        clubDeviceId
        email
        name
        createdAt
        updatedAt
      }
    }
  }
`;
