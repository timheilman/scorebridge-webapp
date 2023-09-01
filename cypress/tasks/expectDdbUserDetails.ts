import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { cachedDynamoDbClient } from "../../src/scorebridge-ts-submodule/cachedDynamoDbClient";

interface ExpectedUserDetails {
  email: string;
}
export interface ExpectUserDetailsParams {
  awsRegion: string;
  profile: string;
  userId: string;
  userTableName: string;
  expectedUserDetails: ExpectedUserDetails | null;
}
export const expectDdbUserDetails = async ({
  awsRegion,
  profile,
  expectedUserDetails,
  userTableName,
  userId,
}: ExpectUserDetailsParams) => {
  const actual = await cachedDynamoDbClient(awsRegion, profile).send(
    new GetItemCommand({
      TableName: userTableName,
      Key: marshall({ id: userId }),
    }),
  );
  if (!actual.Item) {
    if (expectedUserDetails === null) {
      return null;
    }
    throw new Error(
      `No user found for user id, but was expecting details ${JSON.stringify(
        expectedUserDetails,
        null,
        2,
      )}. userId: ${userId}`,
    );
  }
  if (expectedUserDetails === null) {
    throw new Error(
      `User found for user id, but was expecting nonexistence. userId: ${userId}`,
    );
  }
  const actualUserEmail = unmarshall(actual.Item).email as string;
  if (actualUserEmail !== expectedUserDetails.email) {
    throw new Error(
      `Expected user detail email: ${expectedUserDetails.email} Actual: ${actualUserEmail}`,
    );
  }
  return null;
};
