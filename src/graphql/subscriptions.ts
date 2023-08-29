import gql from "graphql-tag";

export const subscriptionCreatedClubDevice = gql`
  subscription MySubscription($clubId: String!) {
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
