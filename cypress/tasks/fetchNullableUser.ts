import {
  AdminGetUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";

import cachedCognitoIdpClient from "./lib/cachedCognitoIdpClient";

export interface FetchNullableUserParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  userTableName: string;
}

export const fetchNullableUser = {
  async fetchNullableUser({
    poolId,
    email,
    awsRegion,
    profile,
  }: FetchNullableUserParams) {
    let adminGetUserCommandOutput;
    try {
      adminGetUserCommandOutput = await cachedCognitoIdpClient(
        awsRegion,
        profile,
      ).send(
        new AdminGetUserCommand({
          UserPoolId: poolId,
          Username: email,
        }),
      );
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return null;
      }
      throw e;
    }

    const userId = adminGetUserCommandOutput.Username as string;
    if (adminGetUserCommandOutput.UserAttributes) {
      console.log(`AllOutput: ${JSON.stringify(adminGetUserCommandOutput)}`);
      const foundClub = adminGetUserCommandOutput.UserAttributes.find(
        (v) => v.Name === "custom:tenantId",
      );
      if (foundClub) {
        return { userId, clubId: foundClub.Value as string };
      } else {
        return { userId };
      }
    } else {
      throw new Error("No userAttributes found");
    }
  },
};