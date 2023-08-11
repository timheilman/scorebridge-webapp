import {
  AdminGetUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";

import createCognitoIdentityProviderClient from "./createCognitoIdentityProviderClient";

export interface FetchNullableUserParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  userTableName: string;
}
export const fetchNullableUser = async ({
  poolId,
  email,
  awsRegion,
  profile,
}: FetchNullableUserParams) => {
  const cogClient = createCognitoIdentityProviderClient(awsRegion, profile);
  let adminGetUserCommandOutput;
  try {
    adminGetUserCommandOutput = await cogClient.send(
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
    const foundClub = adminGetUserCommandOutput.UserAttributes.find(
      (v) => v.Name === "custom:tenantId",
    );
    if (foundClub) {
      return { userId, clubId: foundClub.Value as string };
    } else {
      throw new Error("No custom:tenantId attribute found");
    }
  } else {
    throw new Error("No userAttributes found");
  }
};
