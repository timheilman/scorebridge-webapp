import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import requiredReactAppEnvVar from "../../requiredReactAppEnvVar";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
export default function SessionlessRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  // When rendering the router header due to logout:
  if (
    ![
      "/signin",
      "/signup",
      "/unexpected_error",
      "/super_chicken_mode",
    ].includes(pathname)
  ) {
    return <Navigate to="/signin" />;
  }
  return (
    <header className="sticky">
      <NavLink to="/signin" className="button rounded">
        <span data-test-id="signInTab" className="icon-user"></span>
        {t("tabs.signIn")}
      </NavLink>
      <NavLink to="/signup" className="button rounded">
        <span data-test-id="signUpTab" className="icon-info"></span>
        {t("tabs.signUp")}
      </NavLink>
      {requiredReactAppEnvVar("STAGE") === "prod" ? "" : <LanguageSelector />}
    </header>
  );
}
