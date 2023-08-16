import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import TypesafeTranslationT from "../../TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
export default function SessionlessRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  if (authStatus !== "authenticated") {
    if (!["/signin", "/signup"].includes(pathname)) {
      return <Navigate to="/signin" />;
    }
  }
  return (
    <header className="sticky">
      <NavLink to="/signin" className="button rounded">
        <span data-test-id="signInTab" className="icon-user"></span>
        {t("signIn")}
      </NavLink>
      <NavLink to="/signup" className="button rounded">
        <span data-test-id="signUpTab" className="icon-info"></span>
        {t("signUp")}
      </NavLink>
      <span>
        <LanguageSelector />
      </span>
    </header>
  );
}
