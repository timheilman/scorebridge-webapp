import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

import { cachedSecretsManagerClient } from "../../src/scorebridge-ts-submodule/cachedSecretsManagerClient";

export interface FetchSecretParams {
  secretName: string;
  awsRegion: string;
  profile: string;
}
export const fetchSecret = async ({
  secretName,
  awsRegion,
  profile,
}: FetchSecretParams): Promise<Record<string, unknown>> => {
  const response = await cachedSecretsManagerClient(awsRegion, profile).send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );
  const secretJson = response.SecretString;
  return JSON.parse(secretJson!) as Record<string, unknown>;
};
