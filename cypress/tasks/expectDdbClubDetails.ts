import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { cachedDynamoDbClient } from "./lib/cachedDynamoDbClient";

interface ExpectClubDetails {
  name: string;
}

export interface ExpectClubNameParams {
  awsRegion: string;
  profile: string;
  clubId: string;
  clubTableName: string;
  expectedClubDetails: ExpectClubDetails | null;
}
export const expectDdbClubDetails = {
  async expectDdbClubDetails({
    awsRegion,
    profile,
    clubId,
    expectedClubDetails,
    clubTableName,
  }: ExpectClubNameParams) {
    const actual = await cachedDynamoDbClient(awsRegion, profile).send(
      new GetItemCommand({
        TableName: clubTableName,
        Key: marshall({ id: clubId }),
      }),
    );
    if (!actual.Item) {
      if (expectedClubDetails === null) {
        return null;
      }
      throw new Error(
        `No club found for club id, but was expecting details ${JSON.stringify(
          expectedClubDetails,
          null,
          2,
        )}. clubId: ${clubId}`,
      );
    }
    if (expectedClubDetails === null) {
      throw new Error(
        `Club found for club id, but was expecting nonexistence. clubId: ${clubId}`,
      );
    }
    const unmarshalledItem = unmarshall(actual.Item);
    const actualClubName = unmarshalledItem.name as string;
    if (actualClubName !== expectedClubDetails.name) {
      throw new Error(
        `Expected club name: ${expectedClubDetails.name} Actual: ${actualClubName}`,
      );
    }
    return null;
  },
};
