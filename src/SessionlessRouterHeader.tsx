import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import TypesafeTranslationT from "./TypesafeTranslationT";
export default function SessionlessRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  if (authStatus !== "authenticated") {
    if (!["/", "/signup"].includes(pathname)) {
      return <Navigate to="/" />;
    }
  }
  return (
    <header className="sticky">
      <NavLink to="/" className="button rounded">
        <span data-test-id="signInTab" className="icon-user"></span>
        {t("signIn")}
      </NavLink>
      <NavLink to="/signup" className="button rounded">
        <span data-test-id="signUpTab" className="icon-info"></span>
        {t("signUp")}
      </NavLink>
      <span>
        <SelectedLanguage />
      </span>
    </header>
  );
}
