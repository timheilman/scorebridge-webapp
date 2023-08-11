import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import fromSsoUsingProfile from "./from-sso-using-profile";

export function createDynamoDbClient(awsRegion: string, profile: string) {
  return new DynamoDBClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
}
