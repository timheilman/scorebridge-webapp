import gql from "graphql-tag";

export const subscriptionCreatedClubDevice = gql`
  subscription CreatedClubDevice($clubId: String!) {
    createdClubDevice(clubId: $clubId) {
      clubDeviceId
      clubId
      createdAt
      email
      name
      updatedAt
    }
  }
`;

export const subscriptionDeletedClubDevice = gql`
  subscription DeletedClubDevice($clubId: String!) {
    deletedClubDevice(clubId: $clubId) {
      clubDeviceId
      clubId
      createdAt
      email
      name
      updatedAt
    }
  }
`;
