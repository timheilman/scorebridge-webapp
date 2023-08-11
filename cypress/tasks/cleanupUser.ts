import {
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import createCognitoIdentityProviderClient from "../support/createCognitoIdentityProviderClient";
import { createDynamoDbClient } from "../support/createDynamoDbClient";

export interface CleanupUserParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  userTableName: string;
  clubTableName: string;
}
export const cleanupUser = {
  async cleanupUser({
    awsRegion,
    profile,
    poolId,
    email,
    userTableName,
    clubTableName,
  }: CleanupUserParams) {
    console.log(`Cleaning up user ${email}`);
    const cogClient = createCognitoIdentityProviderClient(awsRegion, profile);
    const poolAndName = {
      UserPoolId: poolId,
      Username: email,
    };
    let userId: string;
    let clubId: string;
    try {
      const adminGetUserCommandOutput = await cogClient.send(
        new AdminGetUserCommand(poolAndName),
      );
      userId = adminGetUserCommandOutput.Username as string;
      if (adminGetUserCommandOutput.UserAttributes) {
        const foundClub = adminGetUserCommandOutput.UserAttributes.find(
          (v) => v.Name === "custom:tenantId",
        );
        if (foundClub) {
          clubId = foundClub.Value as string;
        } else {
          throw new Error("No custom:tenantId attribute found");
        }
      } else {
        throw new Error("No userAttributes found");
      }
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return null;
      }
      throw e;
    }
    const ddbClient = createDynamoDbClient(awsRegion, profile);
    await Promise.all([
      cogClient.send(new AdminDeleteUserCommand({ ...poolAndName })),
      ddbClient.send(
        new DeleteItemCommand({
          TableName: userTableName,
          Key: marshall({ id: userId }),
        }),
      ),
      ddbClient.send(
        new DeleteItemCommand({
          TableName: clubTableName,
          Key: marshall({ id: clubId }),
        }),
      ),
    ]);
    return null;
  },
};
