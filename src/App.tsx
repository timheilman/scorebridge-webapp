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

import { userInGroup } from "./cognito";
import ScoreBridgeAuthenticator from "./features/./signIn/ScoreBridgeAuthenticator";
import SignUpForm from "./features/./signUp/SignUpForm";
import UnexpectedError from "./features/./unexpectedError/UnexpectedError";
import ClubDevicesPage from "./features/clubDevices/ClubDevicesPage";
import SessionfulRouterHeader from "./features/header/SessionfulRouterHeader";
import SessionlessRouterHeader from "./features/header/SessionlessRouterHeader";
import PlayersPage from "./features/players/PlayersPage";
import RotationPage from "./features/rotation/RotationPage";
import TypesafeTranslationT from "./TypesafeTranslationT";

// TODO: customize the Authenticator component to use our own i18n w/these translations and remove this:
amplifyI18n.putVocabularies(amplifyUiReactTranslations);

// custom components, good idea for use case:
// function StatusBar() {
//   const isOnline = useOnlineStatus();
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
// }
export default function App() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
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
                authStatus === "authenticated" &&
                !userInGroup(user, "adminSuper") ? (
                  <Navigate to="/club_devices" />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route path="/signin" element={<ScoreBridgeAuthenticator />} />
            <Route path="/signup" element={<SignUpForm />} />
            {/*<Route path="/projects/:id" element={<ProjectPage />} />*/}
            <Route path="/club_devices" element={<ClubDevicesPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/rotation" element={<RotationPage />} />
            <Route path="/unexpected_error" element={<UnexpectedError />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
