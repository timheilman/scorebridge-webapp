import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { cachedDynamoDbClient } from "./lib/cachedDynamoDbClient";

interface ExpectedUserDetails {
  email: string;
}
export interface ExpectUserDetailsParams {
  awsRegion: string;
  profile: string;
  userId: string;
  userTableName: string;
  expectedUserDetails: ExpectedUserDetails;
}
export const expectUserDetails = {
  async expectUserDetails({
    awsRegion,
    profile,
    expectedUserDetails,
    userTableName,
    userId,
  }: ExpectUserDetailsParams) {
    const actual = await cachedDynamoDbClient(awsRegion, profile).send(
      new GetItemCommand({
        TableName: userTableName,
        Key: marshall({ id: userId }),
      }),
    );
    if (!actual.Item) {
      throw new Error(`No user found for user id.  userId: ${userId}`);
    }
    const actualUserEmail = unmarshall(actual.Item).email as string;
    if (actualUserEmail !== expectedUserDetails.email) {
      throw new Error(
        `task-based equality expectation failure. Expected: ${expectedUserDetails.email} Actual: ${actualUserEmail}`,
      );
    }
    return null;
  },
};
