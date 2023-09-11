import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { cachedAwsSdkV3Client } from "./cachedAwsSdkV3Client";

const profileDict: {
  [awsRegion: string]: { [profile: string]: CognitoIdentityProviderClient };
} = {};
const envDict: {
  [awsRegion: string]: CognitoIdentityProviderClient;
} = {};

export const cachedCognitoIdpClient = (
  awsRegion: string,
  profile: string | null,
): CognitoIdentityProviderClient => {
  return cachedAwsSdkV3Client<CognitoIdentityProviderClient>(
    CognitoIdentityProviderClient,
    awsRegion,
    profile,
    profileDict,
    envDict,
  );
};
