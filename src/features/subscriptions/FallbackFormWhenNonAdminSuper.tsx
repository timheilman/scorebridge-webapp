import { useAuthenticator } from "@aws-amplify/ui-react";

import { userInGroup } from "../../cognito";
import OverrideClubIdFormExpectingFailure from "./OverrideClubIdFormExpectingFailure";

export default function FallbackFormWhenNonAdminSuper() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit to SuperChickenMode!</p>
        <OverrideClubIdFormExpectingFailure subscriptionId="createdClubDevice" />
      </>
    );
  }
  if (!userInGroup(user, "adminSuper")) {
    return (
      <>
        <p>AdminClub visit to SuperChickenMode!</p>
        <OverrideClubIdFormExpectingFailure subscriptionId="createdClubDevice" />
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
