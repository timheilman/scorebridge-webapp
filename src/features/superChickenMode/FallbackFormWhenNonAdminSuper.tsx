import { useAuthenticator } from "@aws-amplify/ui-react";

import { userInGroup } from "../../cognito";
import { OverrideClubIdForm } from "../subscriptions/OverrideClubIdForm";

export default function FallbackFormWhenNonAdminSuper() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit to SuperChickenMode!</p>
        <OverrideClubIdForm />
      </>
    );
  }
  if (!userInGroup(user, "adminSuper")) {
    return (
      <>
        <p>AdminClub visit to SuperChickenMode!</p>
        <OverrideClubIdForm />
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
