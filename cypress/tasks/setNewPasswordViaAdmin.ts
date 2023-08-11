import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

import createCognitoIdentityProviderClient from "./lib/createCognitoIdentityProviderClient";

export interface SetNewPasswordViaAdminParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  newPassword: string;
}
export const setNewPasswordViaAdmin = {
  async setNewPasswordViaAdmin({
    awsRegion,
    profile,
    poolId,
    email,
    newPassword,
  }: SetNewPasswordViaAdminParams) {
    const client = createCognitoIdentityProviderClient(awsRegion, profile);
    const input = {
      UserPoolId: poolId,
      Username: email,
      Password: newPassword,
      Permanent: true,
    };
    const command = new AdminSetUserPasswordCommand(input);
    return client.send(command);
  },
};
