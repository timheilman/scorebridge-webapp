import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { createDynamoDbClient } from "./lib/createDynamoDbClient";

export interface ExpectClubNameParams {
  awsRegion: string;
  profile: string;
  clubId: string;
  clubTableName: string;
  expectedClubName: string;
}
export const expectClubName = {
  async expectClubName({
    awsRegion,
    profile,
    clubId,
    expectedClubName,
    clubTableName,
  }: ExpectClubNameParams) {
    const ddbClient = createDynamoDbClient(awsRegion, profile);
    const actual = await ddbClient.send(
      new GetItemCommand({
        TableName: clubTableName,
        Key: marshall({ id: clubId }),
      }),
    );
    if (!actual.Item) {
      throw new Error(`No club found for club id.  clubId: ${clubId}`);
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
