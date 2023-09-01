import { AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { logFn } from "../../src/lib/logging";
import { cachedCognitoIdpClient } from "../../src/scorebridge-ts-submodule/cachedCognitoIdpClient";
import {
  fetchNullableCogUser,
  fetchNullableCogUserParams,
} from "./fetchNullableCogUser";
import { cachedDynamoDbClient } from "./lib/cachedDynamoDbClient";
const log = logFn("cypress.tasks.cleanupUser.");
export interface CleanupUserParams extends fetchNullableCogUserParams {
  clubTableName: string;
  userTableName: string;
}

export const cleanupUser = async ({
  awsRegion,
  profile,
  poolId,
  email,
  userTableName,
  clubTableName,
}: CleanupUserParams) => {
  log("cleanupUser.start", "debug", { email });
  const poolAndName = {
    UserPoolId: poolId,
    Username: email,
  };
  const cogUser = await fetchNullableCogUser({
    awsRegion,
    profile,
    poolId,
    email,
  });
  if (!cogUser) {
    return null;
  }
  const promises: Promise<unknown>[] = [];
  promises.push(
    cachedCognitoIdpClient(awsRegion, profile).send(
      new AdminDeleteUserCommand({ ...poolAndName }),
    ),
  );
  promises.push(
    cachedDynamoDbClient(awsRegion, profile).send(
      new DeleteItemCommand({
        TableName: userTableName,
        Key: marshall({ id: cogUser.userId }),
      }),
    ),
  );
  if (cogUser.clubId) {
    promises.push(
      cachedDynamoDbClient(awsRegion, profile).send(
        new DeleteItemCommand({
          TableName: clubTableName,
          Key: marshall({ id: cogUser.clubId }),
        }),
      ),
    );
  }
  // we are ignoring errors, in that it would be testing test code
  await Promise.allSettled(promises);
  return null;
};
