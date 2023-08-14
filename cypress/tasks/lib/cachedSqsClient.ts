import { SQSClient } from "@aws-sdk/client-sqs";

import fromSsoUsingProfile from "./from-sso-using-profile";

const dict: { [awsRegion: string]: { [profile: string]: SQSClient } } = {};

export function cachedSqsClient(awsRegion: string, profile: string) {
  if (dict[awsRegion] && dict[awsRegion][profile]) {
    return dict[awsRegion][profile];
  }
  if (!dict[awsRegion]) {
    dict[awsRegion] = {};
  }
  console.log(`Profile ${profile}`);
  dict[awsRegion][profile] = new SQSClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
  return dict[awsRegion][profile];
}