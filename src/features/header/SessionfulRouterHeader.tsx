import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { selectSuperChickenMode } from ".././superChickenMode/superChickenModeSlice";
import LanguageSelector from "../languageSelector/LanguageSelector";
import SignOutButton from "../signIn/SignOutButton";

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const superChickenMode = useAppSelector(selectSuperChickenMode);
  if (["/signin", "/signup"].includes(pathname)) {
    // naturally move to this page when logging in, and so the above tabs disappear:
    return <Navigate to="/club_devices" />;
  }
  function superChickenNavLink() {
    if (!superChickenMode) {
      return;
    }
    return (
      <NavLink
        to="super_chicken_mode"
        className="button rounded"
        data-test-id="superChickenModeTab"
      >
        {t("tabs.superChickenMode")}
      </NavLink>
    );
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
      {superChickenNavLink()}
      <LanguageSelector />
      <SignOutButton />
    </header>
  );
}
