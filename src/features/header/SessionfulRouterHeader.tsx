import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { useClubId } from "../../lib/useClubId";
import requiredEnvVar from "../../requiredEnvVar";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
import SignOutButton from "../signIn/SignOutButton";
import Subscriptions from "../subscriptions/Subscriptions";
import SuperChickenModeNavLink from "./SuperChickenModeNavLink";

// const log = logFn("src.features.header.SessionfulRouterHeader");

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const [fallbackClubId, setFallbackClubId] = useState("");
  const clubId = useClubId();
  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    setFallbackClubId(event.target.value);
  };

  const guaranteedClubId = clubId ? clubId : fallbackClubId;
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
      <SuperChickenModeNavLink />
      {requiredEnvVar("STAGE") === "prod" ? "" : <LanguageSelector />}
      <SignOutButton />
      {guaranteedClubId.length === 26 ? (
        <Subscriptions clubId={guaranteedClubId} />
      ) : (
        <></>
      )}
      {clubId ? (
        ""
      ) : (
        <>
          <label htmlFor="fallbackClubId">
            {t("tabs.subscriptions.fallbackClubId")}
          </label>
          <input
            type="text"
            id="fallbackClubId"
            placeholder={t("tabs.subscriptions.fallbackClubId.placeholder")}
            onChange={handleChangeFallbackClubId}
            data-test-id="fallbackClubId"
          />
        </>
      )}
    </header>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
