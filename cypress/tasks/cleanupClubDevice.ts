import { AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { cachedCognitoIdpClient } from "../../src/scorebridge-ts-submodule/cachedCognitoIdpClient";
import { cachedDynamoDbClient } from "../../src/scorebridge-ts-submodule/cachedDynamoDbClient";
import { cypressTaskLogFn } from "../support/cypressTaskLogFn";
import { fetchNullableCogUser } from "./fetchNullableCogUser";
const log = cypressTaskLogFn("cypress.tasks.cleanupClubDevice.");
export interface CleanupClubDeviceParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  email: string;
  clubDevicesTableName: string;
}

export const cleanupClubDevice = async ({
  awsRegion,
  profile,
  poolId,
  email,
  clubDevicesTableName,
}: CleanupClubDeviceParams) => {
  log("cleanupClubDevice.start", "debug", { email });
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
        TableName: clubDevicesTableName,
        Key: marshall({ id: cogUser.userId }),
      }),
    ),
  );
  promises.push(
    cachedDynamoDbClient(awsRegion, profile).send(
      new DeleteItemCommand({
        TableName: clubDevicesTableName,
        Key: marshall({ clubId: cogUser.clubId, clubDeviceId: cogUser.userId }),
      }),
    ),
  );
  // we are ignoring errors, in that it would be testing test code
  await Promise.allSettled(promises);
  return null;
};
