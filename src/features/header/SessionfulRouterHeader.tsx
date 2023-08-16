import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { userInGroup } from "../../cognito";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import LanguageSelector from "../languageSelector/LanguageSelector";
import SignOutButton from "../signIn/SignOutButton";

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { user } = useAuthenticator((context) => [context.user]);
  if (
    !(
      userInGroup(user, "adminSuper") || process.env.REACT_APP_STAGE !== "prod"
    ) &&
    ["/signin", "/signup"].includes(pathname)
  ) {
    return <Navigate to="/club_devices" />;
  }
  return (
    <header className="sticky">
      {userInGroup(user, "adminSuper") ||
      process.env.REACT_APP_STAGE !== "prod" ? (
        <>
          <NavLink to="/signin" className="button rounded">
            <span data-test-id="signInTab" className="icon-user"></span>
            {t("signIn")}
          </NavLink>
          <NavLink to="/signup" className="button rounded">
            <span data-test-id="signUpTab" className="icon-info"></span>
            {t("signUp")}
          </NavLink>
        </>
      ) : (
        <></>
      )}
      <NavLink to="/club_devices" className="button rounded">
        {t("club devices")}
      </NavLink>
      <NavLink to="/players" className="button rounded">
        {t("players")}
      </NavLink>
      <NavLink to="/rotation" className="button rounded">
        {t("rotation")}
      </NavLink>
      <LanguageSelector />
      <SignOutButton />
    </header>
  );
}
