import { AmplifyUser } from "@aws-amplify/ui";

export function userInGroup(user: AmplifyUser, group: string): boolean {
  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    !user
      ?.getSignInUserSession()
      ?.getIdToken()
      ?.payload["cognito:groups"]?.includes(group)
  ) {
    return false;
  }
  return true;
}
