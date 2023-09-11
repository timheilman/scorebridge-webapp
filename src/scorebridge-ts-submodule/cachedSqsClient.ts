import { SQSClient } from "@aws-sdk/client-sqs";

import { cachedAwsSdkV3Client } from "./cachedAwsSdkV3Client";

const profileDict: {
  [awsRegion: string]: { [profile: string]: SQSClient };
} = {};
const envDict: {
  [awsRegion: string]: SQSClient;
} = {};

export const cachedSqsClient = (
  awsRegion: string,
  profile: string | null,
): SQSClient => {
  return cachedAwsSdkV3Client<SQSClient>(
    SQSClient,
    awsRegion,
    profile,
    profileDict,
    envDict,
  );
};
