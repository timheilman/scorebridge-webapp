import "./App.css";

import { translations as amplifyUiReactTranslations } from "@aws-amplify/ui-react";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { Auth, I18n as amplifyI18n } from "aws-amplify";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { mergeDeepRight } from "ramda";
import { useEffect, useState } from "react";
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
import { translationStrings } from "./translationStrings";

const langCodeList = getLangCodeList();
const languageOptions = Object.keys(amplifyUiReactTranslations)
  .filter((amplifyUiReactXlationLangCode) =>
    langCodeList.includes(amplifyUiReactXlationLangCode),
  )
  .map((amplifyUiReactXlationLangCode) => {
    return {
      value: amplifyUiReactXlationLangCode,
      // type safety of this cast is ostensibly guaranteed by the filter and the library
      label: getLangNameFromCode(amplifyUiReactXlationLangCode)?.name as string,
    };
  });

amplifyI18n.putVocabularies(
  // TODO: have react-i18next take over translationStrings
  mergeDeepRight(amplifyUiReactTranslations, translationStrings),
);
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
  useEffect(() => {
    Auth.currentSession()
      .then((session) => {
        setSessionRequestResolved(true);
        console.log(`Got session ${JSON.stringify(session, null, 2)}`);
        setCognitoUserSession(session);
      })
      .catch((reason) => {
        setSessionRequestResolved(true);
        // console.log("amplifyUiReactTranslations", amplifyUiReactTranslations);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (!`${reason}`.match(/No current user/)) {
          console.error(`problem loading cognitoUserSession`, reason);
        }
      });
  });
  if (!sessionRequestResolved) {
    return <p>Loading user session</p>;
  } else if (!cognitoUserSession) {
    return (
      <>
        <SelectedLanguage options={languageOptions} />
        <Router>
          <header className="sticky">
            <span className="logo">
              <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" />
            </span>
            <NavLink to="/" className="button rounded">
              <span className="icon-user"></span>
              Sign In
            </NavLink>
            <NavLink to="/signup" className="button rounded">
              <span className="icon-info"></span>
              Sign Up
            </NavLink>
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
      <Router>
        <header className="sticky">
          <span className="logo">
            <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" />
          </span>
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
    );
  }
}
