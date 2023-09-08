import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { userInGroup } from "../../cognito";
import { useClubId } from "../../lib/useClubId";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
import { selectLanguageResolved } from "../languageSelector/selectedLanguageSlice";
import SignOutButton from "../signIn/SignOutButton";
import { OverrideClubIdForm } from "../subscriptions/OverrideClubIdForm";
import { SubscriptionComponent } from "../superChickenMode/SubscriptionComponent";

// const log = logFn("src.features.header.SessionfulRouterHeader");

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);
  const clubId = useClubId();
  const languageResolved = useAppSelector(selectLanguageResolved);
  if (!clubId && userInGroup(user, "adminClub")) {
    throw new Error("adminClub member has no clubId");
  }
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
      <LanguageSelector />
      <SignOutButton />
      {userInGroup(user, "adminSuper") ? <OverrideClubIdForm /> : ""}
      {/*only start subscriptions once selectedLanguage is established */}
      {authStatus === "authenticated" && clubId && languageResolved ? (
        <SubscriptionComponent
          clubId={clubId}
          authMode="AMAZON_COGNITO_USER_POOLS"
        />
      ) : (
        ""
      )}
    </header>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
