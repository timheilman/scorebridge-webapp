import { AdminListGroupsForUserCommand } from "@aws-sdk/client-cognito-identity-provider";

import { logFn } from "../../src/lib/logging";
import cachedCognitoIdpClient from "./lib/cachedCognitoIdpClient";
const log = logFn("cypress.tasks.fetchGroupsForUser");

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
    log(
      "debug",
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
