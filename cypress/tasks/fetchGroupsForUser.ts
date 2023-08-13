import { AdminListGroupsForUserCommand } from "@aws-sdk/client-cognito-identity-provider";

import cachedCognitoIdpClient from "./lib/cachedCognitoIdpClient";

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
    const result = await cachedCognitoIdpClient(awsRegion, profile).send(
      new AdminListGroupsForUserCommand({
        UserPoolId: poolId,
        Username: userId,
      }),
    );
    console.log(
      `fetchGroupsForUserCognitoResult ${JSON.stringify(result, null, 2)}`,
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
