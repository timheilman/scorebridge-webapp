import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { cachedAwsSdkV3Client } from "./cachedAwsSdkV3Client";

const profileDict: {
  [awsRegion: string]: { [profile: string]: DynamoDBClient };
} = {};
const envDict: {
  [awsRegion: string]: DynamoDBClient;
} = {};

export const cachedDynamoDbClient = (
  awsRegion: string,
  profile: string | null,
): DynamoDBClient => {
  return cachedAwsSdkV3Client<DynamoDBClient>(
    DynamoDBClient,
    awsRegion,
    profile,
    profileDict,
    envDict,
  );
};
