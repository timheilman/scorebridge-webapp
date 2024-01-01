import { useAuthenticator } from "@aws-amplify/ui-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FeatherIcon from "feather-icons-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import OnlineStatus from "../../scorebridge-ts-submodule/react/OnlineStatus";
import { subIdToSubGql } from "../../scorebridge-ts-submodule/react/subscriptionStatesSlice";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
import { selectLanguageResolved } from "../languageSelector/selectedLanguageSlice";
import SignOutButton from "../signIn/SignOutButton";
import { OverrideClubIdForm } from "../subscriptions/OverrideClubIdForm";
import { SubscriptionsComponent } from "../subscriptions/SubscriptionsComponent";
import { selectCognitoGroups } from "./idTokenSlice";

// const log = logFn("src.features.header.SessionfulRouterHeader");

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);
  const clubId = useClubId();
  const cognitoGroups = useAppSelector(selectCognitoGroups);
  const languageResolved = useAppSelector(selectLanguageResolved);
  if (!cognitoGroups) {
    throw new Error("cognitoGroups is null in SessionfulRouterHeader");
  }
  if (!clubId && !cognitoGroups.includes("adminSuper")) {
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
      {cognitoGroups.includes("adminSuper") ? <OverrideClubIdForm /> : ""}
      {/*only start subscriptions once selectedLanguage is established */}
      {authStatus === "authenticated" && clubId && languageResolved ? (
        <>
          <SubscriptionsComponent clubId={clubId} authMode="userPool" />
          <OnlineStatus
            upIcon={<FeatherIcon icon="wifi" />}
            downIcon={<FeatherIcon icon="wifi-off" />}
            subscriptionIds={Object.keys(subIdToSubGql)}
          />
        </>
      ) : !languageResolved ? (
        <span>Awaiting language...</span>
      ) : !clubId ? (
        <span>Awaiting clubId...</span>
      ) : (
        ""
      )}
    </header>
  );
}
