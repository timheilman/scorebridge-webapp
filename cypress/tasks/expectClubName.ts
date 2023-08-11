import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { CleanupUserParams } from "./cleanupUser";
import { createDynamoDbClient } from "./lib/createDynamoDbClient";
import { fetchNullableUser } from "./lib/fetchNullableUser";

export interface ExpectClubNameParams extends CleanupUserParams {
  expectedClubName: string;
}
export const expectClubName = {
  async expectClubName({
    awsRegion,
    profile,
    email,
    expectedClubName,
    clubTableName,
    poolId,
    userTableName,
  }: ExpectClubNameParams) {
    const user = await fetchNullableUser({
      userTableName,
      poolId,
      email,
      awsRegion,
      profile,
    });
    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    const ddbClient = createDynamoDbClient(awsRegion, profile);
    const actual = await ddbClient.send(
      new GetItemCommand({
        TableName: clubTableName,
        Key: marshall({ id: user.clubId }),
      }),
    );
    if (!actual.Item) {
      throw new Error(
        `No club found for club id.  email: ${email} userId: ${user.userId} clubId: ${user.clubId}`,
      );
    }
    const actualClubName = unmarshall(actual.Item).name as string;
    if (actualClubName !== expectedClubName) {
      throw new Error(
        `task-based equality expectation failure. Expected: ${expectedClubName} Actual: ${actualClubName}`,
      );
    }
    return null;
  },
};
