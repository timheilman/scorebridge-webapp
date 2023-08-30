import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

import cachedCognitoIdpClient from "./lib/cachedCognitoIdpClient";

export interface SetNewPasswordViaAdminParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  newPassword: string;
}
export const setNewPasswordViaAdmin = async ({
  awsRegion,
  profile,
  poolId,
  email,
  newPassword,
}: SetNewPasswordViaAdminParams) => {
  const input = {
    UserPoolId: poolId,
    Username: email,
    Password: newPassword,
    Permanent: true,
  };
  const command = new AdminSetUserPasswordCommand(input);
  return cachedCognitoIdpClient(awsRegion, profile).send(command);
};
