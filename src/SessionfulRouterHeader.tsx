import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import SignOutButton from "./features/authAuth/SignOutButton";
import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import TypesafeTranslationT from "./TypesafeTranslationT";
export function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  return (
    <header className="sticky">
      <NavLink to="/table_tablets" className="button rounded">
        {t("tableTablets")}
      </NavLink>
      <NavLink to="/projects" className="button rounded">
        {t("projects")}
      </NavLink>
      <NavLink to="/helloworld" className="button rounded">
        Hello World Hands-On-React Examples
      </NavLink>
      <NavLink to="/counter" className="button rounded">
        Redux repo example counter-ts
      </NavLink>
      <SelectedLanguage />
      <SignOutButton />
    </header>
  );
}
