import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import fromSsoUsingProfile from "./from-sso-using-profile";

export default function createCognitoIdentityProviderClient(
  awsRegion: string,
  profile: string,
) {
  return new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
}
