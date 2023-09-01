import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { userInGroup } from "../../cognito";
import { useClubId } from "../../lib/useClubId";
import requiredReactAppEnvVar from "../../requiredReactAppEnvVar";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
import SignOutButton from "../signIn/SignOutButton";
import { OverrideClubIdFormExpectingSuccess } from "../subscriptions/OverrideClubIdFormExpectingSuccess";
import Subscriptions from "../subscriptions/Subscriptions";

// const log = logFn("src.features.header.SessionfulRouterHeader");

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const clubId = useClubId();
  const { user } = useAuthenticator((context) => [context.user]);

  if (["/signin", "/signup"].includes(pathname)) {
    // naturally move to this page when logging in, and so the above tabs disappear:
    return <Navigate to="/club_devices" />;
  }
  return (
    <header className="sticky">
      <NavLink to="/club_devices" className="button rounded">
        {t("tabs.clubDevices")}
      </NavLink>
      <NavLink to="/players" className="button rounded">
        {t("tabs.players")}
      </NavLink>
      <NavLink to="/rotation" className="button rounded">
        {t("tabs.rotation")}
      </NavLink>
      <NavLink
        to="/forget_me"
        className="button rounded"
        data-test-id="forgetMeTab"
      >
        {t("tabs.forgetMe")}
      </NavLink>
      {requiredReactAppEnvVar("STAGE") === "prod" ? "" : <LanguageSelector />}
      <SignOutButton />
      {clubId ? <Subscriptions clubId={clubId} /> : ""}
      {userInGroup(user, "adminSuper") ? (
        <OverrideClubIdFormExpectingSuccess />
      ) : (
        ""
      )}
    </header>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
