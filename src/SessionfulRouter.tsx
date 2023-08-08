import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import CounterApp from "./features/counter/CounterApp";
import ProjectPage from "./features/projects/ProjectPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import HomePage from "./home/HomePage";
import TypesafeTranslationT from "./TypesafeTranslationT";
export interface SessionfulRouterProps {
  languageOptions: { label: string; value: string }[];
}
export function SessionfulRouter({ languageOptions }: SessionfulRouterProps) {
  const t = useTranslation().t as TypesafeTranslationT;
  return (
    <Router>
      <header className="sticky">
        <NavLink to="/" className="button rounded">
          <span className="icon-home"></span>
          {t("signUp")}
        </NavLink>
        <NavLink to="/projects" className="button rounded">
          ProjectNavLink
        </NavLink>
        <NavLink to="/helloworld" className="button rounded">
          Hello World Hands-On-React Examples
        </NavLink>
        <NavLink to="/counter" className="button rounded">
          Redux repo example counter-ts
        </NavLink>
        <SelectedLanguage options={languageOptions} />
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/counter" element={<CounterApp />} />
        </Routes>
      </div>
    </Router>
  );
}
