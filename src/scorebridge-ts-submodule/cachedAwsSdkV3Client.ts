import { fromEnv } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentityProvider } from "@smithy/types/dist-types/identity/awsCredentialIdentity";

import fromSsoUsingProfile from "./fromSsoUsingProfile";

interface AwsClientConstructor<T> {
  new (params: {
    region: string;
    credentials: AwsCredentialIdentityProvider;
  }): T;
}
export function cachedAwsSdkV3Client<T>(
  klass: AwsClientConstructor<T>,
  awsRegion: string,
  profile: string | null,
  profileDict: {
    [awsRegion: string]: { [profile: string]: T };
  },
  envDict: {
    [awsRegion: string]: T;
  },
) {
  if (profile) {
    if (profileDict[awsRegion] && profileDict[awsRegion][profile]) {
      return profileDict[awsRegion][profile];
    }
    if (!profileDict[awsRegion]) {
      profileDict[awsRegion] = {};
    }
    profileDict[awsRegion][profile] = new klass({
      region: awsRegion,
      credentials: fromSsoUsingProfile(profile),
    });
    return profileDict[awsRegion][profile];
  }
  if (envDict[awsRegion]) {
    return envDict[awsRegion];
  }
  envDict[awsRegion] = new klass({
    region: awsRegion,
    credentials: fromEnv(),
  });
  return envDict[awsRegion];
}
