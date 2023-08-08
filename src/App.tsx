import "./App.css";
import "./App.css";

import { translations as amplifyUiReactTranslations } from "@aws-amplify/ui-react";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { Auth, I18n as amplifyI18n } from "aws-amplify";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SessionfulRouter } from "./SessionfulRouter";
import SessionlessRouter from "./SessionlessRouter";
import TypesafeTranslationT from "./TypesafeTranslationT";

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

// custom hooks, good idea for use case:
// function StatusBar() {
//   const isOnline = useOnlineStatus();
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
function logSession(session: CognitoUserSession) {
  console.log(
    `cognitoUserSession request success: ${JSON.stringify(session, null, 2)}`,
  );
}

function handleFailedSessionFetch(reason: unknown) {
  // console.log("amplifyUiReactTranslations", amplifyUiReactTranslations);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  if (!`${reason}`.match(/No current user/)) {
    console.error(`cognitoUserSession request failed`, reason);
  } else {
    console.log(
      `cognitoUserSession expected case: no user yet; session still null`,
    );
  }
}

// }
export default function App() {
  const [cognitoUserSession, setCognitoUserSession] =
    useState<CognitoUserSession | null>(null);
  const [sessionRequestResolved, setSessionRequestResolved] = useState(false);
  const t = useTranslation("translation").t as TypesafeTranslationT;
  useEffect(() => {
    Auth.currentSession()
      .then((session) => {
        setSessionRequestResolved(true);
        logSession(session);
        setCognitoUserSession(session);
      })
      .catch((reason) => {
        setSessionRequestResolved(true);
        handleFailedSessionFetch(reason);
      });
    console.log("cognitoUserSession request issued...");
  });
  if (!sessionRequestResolved) {
    return <p>Loading user session</p>;
  }
  return (
    <>
      <h2>{t("appTitle")}</h2>
      {cognitoUserSession ? (
        <SessionfulRouter languageOptions={languageOptions} />
      ) : (
        <SessionlessRouter languageOptions={languageOptions} />
      )}
    </>
  );
}
