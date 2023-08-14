import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import fromSsoUsingProfile from "./fromSsoUsingProfile";

const dict: {
  [awsRegion: string]: { [profile: string]: CognitoIdentityProviderClient };
} = {};

export default function cachedCognitoIdpClient(
  awsRegion: string,
  profile: string,
) {
  if (dict[awsRegion] && dict[awsRegion][profile]) {
    return dict[awsRegion][profile];
  }
  if (!dict[awsRegion]) {
    dict[awsRegion] = {};
  }
  dict[awsRegion][profile] = new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
  return dict[awsRegion][profile];
}
