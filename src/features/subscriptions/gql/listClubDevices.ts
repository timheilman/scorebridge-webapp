import gql from "graphql-tag";

export const listClubDevicesGql = gql`
  query listClubDevices($input: ListClubDevicesInput!) {
    listClubDevices(input: $input) {
      clubDevices {
        clubDeviceId
        name
        table
      }
    }
  }
`;
