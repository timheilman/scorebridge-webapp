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

export const subscriptionUpdatedClub = gql`
  subscription UpdatedClub($id: String!) {
    updatedClub(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const subscriptionUpdatedClubDevice = gql`
  subscription UpdatedClubDevice($clubId: String!, $clubDeviceId: String) {
    updatedClubDevice(clubId: $clubId, clubDeviceId: $clubDeviceId) {
      clubId
      clubDeviceId
      name
      email
      table
      createdAt
      updatedAt
    }
  }
`;
