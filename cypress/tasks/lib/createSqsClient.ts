import { SQSClient } from "@aws-sdk/client-sqs";

import fromSsoUsingProfile from "./from-sso-using-profile";

export function createSqsClient(awsRegion: string, profile: string) {
  return new SQSClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
}
