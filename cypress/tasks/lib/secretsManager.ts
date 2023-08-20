import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

import fromSsoUsingProfile from "./fromSsoUsingProfile";
const dict: {
  [awsRegion: string]: { [profile: string]: SecretsManagerClient };
} = {};

export const cachedSecretsManagerClient = (
  awsRegion: string,
  profile: string,
) => {
  if (dict[awsRegion] && dict[awsRegion][profile]) {
    return dict[awsRegion][profile];
  }
  if (!dict[awsRegion]) {
    dict[awsRegion] = {};
  }
  dict[awsRegion][profile] = new SecretsManagerClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
  return dict[awsRegion][profile];
};
