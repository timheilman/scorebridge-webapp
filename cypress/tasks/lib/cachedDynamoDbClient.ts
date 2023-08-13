import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import fromSsoUsingProfile from "./from-sso-using-profile";

const dict: { [awsRegion: string]: { [profile: string]: DynamoDBClient } } = {};

export function cachedDynamoDbClient(awsRegion: string, profile: string) {
  if (dict[awsRegion] && dict[awsRegion][profile]) {
    return dict[awsRegion][profile];
  }
  if (!dict[awsRegion]) {
    dict[awsRegion] = {};
  }
  dict[awsRegion][profile] = new DynamoDBClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
  return dict[awsRegion][profile];
}
