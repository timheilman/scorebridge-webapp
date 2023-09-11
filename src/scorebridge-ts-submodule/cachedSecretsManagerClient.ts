import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

import { cachedAwsSdkV3Client } from "./cachedAwsSdkV3Client";

const profileDict: {
  [awsRegion: string]: { [profile: string]: SecretsManagerClient };
} = {};
const envDict: {
  [awsRegion: string]: SecretsManagerClient;
} = {};

export const cachedSecretsManagerClient = (
  awsRegion: string,
  profile: string | null,
): SecretsManagerClient => {
  return cachedAwsSdkV3Client<SecretsManagerClient>(
    SecretsManagerClient,
    awsRegion,
    profile,
    profileDict,
    envDict,
  );
};
