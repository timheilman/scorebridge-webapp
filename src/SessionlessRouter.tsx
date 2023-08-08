import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import { ScoreBridgeAuthenticator } from "./features/authAuth/ScoreBridgeAuthenticator";
import { SignUpPage } from "./features/authAuth/SignUpPage";
import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import TypesafeTranslationT from "./TypesafeTranslationT";
export interface SessionlessRouterProps {
  languageOptions: { label: string; value: string }[];
}
export default function SessionlessRouter({
  languageOptions,
}: SessionlessRouterProps) {
  const t = useTranslation().t as TypesafeTranslationT;
  return (
    <Router>
      <header className="sticky">
        <NavLink to="/" className="button rounded">
          <span className="icon-user"></span>
          {t("signIn")}
        </NavLink>
        <NavLink to="/signup" className="button rounded">
          <span className="icon-info"></span>
          {t("signUp")}
        </NavLink>
        <span>
          <SelectedLanguage options={languageOptions} />
        </span>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<ScoreBridgeAuthenticator />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}
