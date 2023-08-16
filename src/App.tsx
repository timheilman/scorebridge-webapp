import "./App.css";

import {
  translations as amplifyUiReactTranslations,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import TableTabletsPage from "./features/./tableTablets/TableTabletsPage";
import SignUpForm from "./features/addClub/SignUpForm";
import { AdminSuperPane } from "./features/adminSuper/AdminSuperPane";
import { ScoreBridgeAuthenticator } from "./features/authAuth/ScoreBridgeAuthenticator";
import CounterApp from "./features/counter/CounterApp";
import ProjectPage from "./features/projects/ProjectPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import UnexpectedErrors from "./features/unexpectedErrors/UnexpectedErrors";
import { SessionfulRouterHeader } from "./SessionfulRouterHeader";
import SessionlessRouterHeader from "./SessionlessRouterHeader";
import TypesafeTranslationT from "./TypesafeTranslationT";

// TODO: customize the Authenticator component to use our own i18n w/these translations and remove this:
amplifyI18n.putVocabularies(amplifyUiReactTranslations);

// custom hooks, good idea for use case:
// function StatusBar() {
//   const isOnline = useOnlineStatus();
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
// }
export default function App() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const t = useTranslation("translation").t as TypesafeTranslationT;
  if (authStatus === "configuring") {
    return <p>Loading user session</p>;
  }
  return (
    <>
      <h2>{t("appTitle")}</h2>
      <Router>
        {authStatus === "authenticated" ? (
          <SessionfulRouterHeader />
        ) : (
          <SessionlessRouterHeader />
        )}
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                authStatus === "authenticated" ? (
                  <Navigate to="/table_tablets" />
                ) : (
                  <ScoreBridgeAuthenticator />
                )
              }
            />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/counter" element={<CounterApp />} />
            <Route path="/table_tablets" element={<TableTabletsPage />} />
            <Route path="/unexpected_error" element={<UnexpectedErrors />} />
            <Route path="/admin_super" element={<AdminSuperPane />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
