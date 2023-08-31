import { useAuthenticator } from "@aws-amplify/ui-react";

import { userInGroup } from "../../cognito";
import { OverrideClubIdFormExpectingSuccess } from "./OverrideClubIdFormExpectingSuccess";

export default function FallbackFormWhenNonAdminSuper() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit to SuperChickenMode!</p>
        <OverrideClubIdFormExpectingSuccess />
      </>
    );
  }
  if (!userInGroup(user, "adminSuper")) {
    return (
      <>
        <p>AdminClub visit to SuperChickenMode!</p>
        <OverrideClubIdFormExpectingSuccess />
      </>
    );
  }
  return (
    <p>
      AdminSuper visit to SuperChickenMode: not duplicating fallbackClubId form
      in header tab.
    </p>
  );
}
