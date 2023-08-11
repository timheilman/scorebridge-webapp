import {
  AdminDeleteUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import createCognitoIdentityProviderClient from "./lib/createCognitoIdentityProviderClient";
import { createDynamoDbClient } from "./lib/createDynamoDbClient";
import {
  fetchNullableUser,
  FetchNullableUserParams,
} from "./lib/fetchNullableUser";

export interface CleanupUserParams extends FetchNullableUserParams {
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
    const user = await fetchNullableUser({
      awsRegion,
      profile,
      userTableName,
      poolId,
      email,
    });
    if (!user) {
      return null;
    }
    const ddbClient = createDynamoDbClient(awsRegion, profile);
    await Promise.all([
      cogClient.send(new AdminDeleteUserCommand({ ...poolAndName })),
      ddbClient.send(
        new DeleteItemCommand({
          TableName: userTableName,
          Key: marshall({ id: user.userId }),
        }),
      ),
      ddbClient.send(
        new DeleteItemCommand({
          TableName: clubTableName,
          Key: marshall({ id: user.clubId }),
        }),
      ),
    ]);
    return null;
  },
};
