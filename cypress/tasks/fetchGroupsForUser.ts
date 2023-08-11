import { AdminListGroupsForUserCommand } from "@aws-sdk/client-cognito-identity-provider";

import createCognitoIdentityProviderClient from "./lib/createCognitoIdentityProviderClient";

export interface FetchGroupsForUserParams {
  awsRegion: string;
  profile: string;
  poolId: string;
  userId: string;
}
export const fetchGroupsForUser = {
  async fetchGroupsForUser({
    awsRegion,
    profile,
    poolId,
    userId,
  }: FetchGroupsForUserParams): Promise<string[]> {
    const cogClient = createCognitoIdentityProviderClient(awsRegion, profile);
    const result = await cogClient.send(
      new AdminListGroupsForUserCommand({
        UserPoolId: poolId,
        Username: userId,
      }),
    );
    if (result.NextToken) {
      throw new Error("More than one page of groups found; unhandled");
    }
    if (!result.Groups) {
      return [];
    }
    return result.Groups.filter((g) => g.GroupName).map(
      (g) => g.GroupName as string,
    );
  },
};
