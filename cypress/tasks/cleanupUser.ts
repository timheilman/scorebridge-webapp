import { AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import {
  fetchNullableUser as fnuContainer,
  FetchNullableUserParams,
} from "./fetchNullableUser";
import cachedCognitoIdpClient from "./lib/cachedCognitoIdpClient";
import { cachedDynamoDbClient } from "./lib/cachedDynamoDbClient";
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
    const poolAndName = {
      UserPoolId: poolId,
      Username: email,
    };
    const user = await fnuContainer.fetchNullableUser({
      awsRegion,
      profile,
      userTableName,
      poolId,
      email,
    });
    if (!user) {
      return null;
    }
    const promises: Promise<unknown>[] = [];
    promises.push(
      cachedCognitoIdpClient(awsRegion, profile).send(
        new AdminDeleteUserCommand({ ...poolAndName }),
      ),
    );
    if (user.clubId) {
      promises.push(
        cachedDynamoDbClient(awsRegion, profile).send(
          new DeleteItemCommand({
            TableName: clubTableName,
            Key: marshall({ id: user.clubId }),
          }),
        ),
      );
    }
    await Promise.all(promises);
    return null;
  },
};
