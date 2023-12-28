import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify/utils";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectLanguage } from "../languageSelector/selectedLanguageSlice";

function randomLargeInt() {
  return Math.floor(Math.random() * 1000000000);
}

// The Authenticator component does not seem to reliably get re-rendered when amplifyI18n.setLanguage
// gets called.  So, let's break a rule and force update when it does:

export default function ScoreBridgeAuthenticator() {
  const langCode = useAppSelector(selectLanguage);
  const [forceRerenderKey, setForceRerenderKey] = useState(randomLargeInt());
  useEffect(() => {
    if (!langCode) {
      return;
    }
    amplifyI18n.setLanguage(langCode);
    // 2023-12-28 as I learn more about react, this should not be necessary:
    // because langCode is a dependency of this useEffect, the whole component
    // should be rerendered when the langCode changes.  Leaving it for now
    // TODO: test this theory and remove the key= attribute on Authenticator
    setForceRerenderKey(randomLargeInt());
  }, [langCode]);
  return (
    <Authenticator key={forceRerenderKey} hideSignUp={true}>
      {({ /* signOut, */ user }) => (
        <>
          <p>You are signed in. Here are your user details:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </Authenticator>
  );
}
