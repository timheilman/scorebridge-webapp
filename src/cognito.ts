import { AmplifyUser } from "@aws-amplify/ui";

export function userInGroup(user: AmplifyUser, group: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    user
      ?.getSignInUserSession()
      ?.getIdToken()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ?.payload["cognito:groups"]?.includes(group)
  );
}
