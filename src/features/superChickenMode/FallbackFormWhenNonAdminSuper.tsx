import { useAuthenticator } from "@aws-amplify/ui-react";
import { Trans } from "react-i18next";

import { useAppSelector } from "../../app/hooks";
import { selectCognitoGroups } from "../header/idTokenSlice";
import { OverrideClubIdForm } from "../subscriptions/OverrideClubIdForm";

export default function FallbackFormWhenNonAdminSuper() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const cognitoGroups = useAppSelector(selectCognitoGroups);
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit to SuperChickenMode!</p>
        <OverrideClubIdForm />
      </>
    );
  }
  if (!cognitoGroups) {
    return <Trans>SuperChicken awaiting cognito session fetch...</Trans>;
  }
  if (!cognitoGroups.includes("adminSuper")) {
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
