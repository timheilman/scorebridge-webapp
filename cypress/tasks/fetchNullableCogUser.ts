import {
  AdminGetUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";

import { cachedCognitoIdpClient } from "../../src/scorebridge-ts-submodule/cachedCognitoIdpClient";

export interface fetchNullableCogUserParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
}

export const fetchNullableCogUser = async ({
  poolId,
  email,
  awsRegion,
  profile,
}: fetchNullableCogUserParams) => {
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

  const userId = adminGetUserCommandOutput.Username!;
  if (adminGetUserCommandOutput.UserAttributes) {
    const foundClub = adminGetUserCommandOutput.UserAttributes.find(
      (v) => v.Name === "custom:tenantId",
    );
    if (foundClub) {
      return { userId, clubId: foundClub.Value! };
    } else {
      return { userId };
    }
  } else {
    throw new Error("No userAttributes found");
  }
};
