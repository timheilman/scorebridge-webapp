import "./App.css";

import { translations as amplifyUiReactTranslations } from "@aws-amplify/ui-react";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { Auth, I18n as amplifyI18n } from "aws-amplify";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import { ScoreBridgeAuthenticator } from "./features/authAuth/ScoreBridgeAuthenticator";
import { SignUpPage } from "./features/authAuth/SignUpPage";
import CounterApp from "./features/counter/CounterApp";
import HelloWorld from "./features/helloworld/HelloWorld";
import ProjectPage from "./features/projects/ProjectPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import HomePage from "./home/HomePage";

const langCodeList = getLangCodeList();
const languageOptions = ["en", "fr", "zh", "he"]
  .filter((langCode) => langCodeList.includes(langCode)) // should be all true; just for safety
  .map((amplifyUiReactXlationLangCode) => {
    return {
      value: amplifyUiReactXlationLangCode,
      // type safety of this cast is ostensibly guaranteed by the filter and the library
      label: getLangNameFromCode(amplifyUiReactXlationLangCode)
        ?.native as string,
    };
  })
  .sort((vl1, vl2) =>
    vl1.label < vl2.label ? -1 : vl1.label === vl2.label ? 0 : 1,
  );

// TODO: customize the Authenticator component to use our own i18n w/these translations and remove this:
amplifyI18n.putVocabularies(amplifyUiReactTranslations);
const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};

// custom hooks, good idea for use case:
// function StatusBar() {
//   const isOnline = useOnlineStatus();
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
// }
export default function App() {
  const [cognitoUserSession, setCognitoUserSession] =
    useState<CognitoUserSession | null>(null);
  const [sessionRequestResolved, setSessionRequestResolved] = useState(false);
  // complicated types situation with react-i18next makes eslint confused about t
  const t = useTranslation("translation").t as (s: string) => string;
  useEffect(() => {
    Auth.currentSession()
      .then((session) => {
        setSessionRequestResolved(true);
        console.log(
          `cognitoUserSession request success: ${JSON.stringify(
            session,
            null,
            2,
          )}`,
        );
        setCognitoUserSession(session);
      })
      .catch((reason) => {
        setSessionRequestResolved(true);
        // console.log("amplifyUiReactTranslations", amplifyUiReactTranslations);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (!`${reason}`.match(/No current user/)) {
          console.error(`cognitoUserSession request failed`, reason);
        } else {
          console.log(
            `cognitoUserSession expected case: no user yet logged in`,
          );
        }
      });
    console.log("cognitoUserSession request issued...");
  });
  if (!sessionRequestResolved) {
    return <p>Loading user session</p>;
  } else if (!cognitoUserSession) {
    return (
      <>
        <h2>{t("noSessionPageTitle")}</h2>
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
      </>
    );
  } else {
    return (
      <>
        <h2>Duplicate Bridge Scoring Admin Portal</h2>
        <Router>
          <header className="sticky">
            <NavLink to="/" className="button rounded">
              <span className="icon-home"></span>
              Home
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
          </header>
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route
                path="/helloworld"
                element={<HelloWorld person={person} logo={logo} />}
              />
              <Route path="/counter" element={<CounterApp />} />
            </Routes>
          </div>
        </Router>
      </>
    );
  }
}
