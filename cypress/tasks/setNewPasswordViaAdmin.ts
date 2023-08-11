import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

import createCognitoIdentityProviderClient from "../support/createCognitoIdentityProviderClient";
import requiredEnvVar from "../support/requiredEnvVar"; // ES Modules import
// const { CognitoIdentityProviderClient, AdminSetUserPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import

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
