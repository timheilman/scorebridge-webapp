import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectLanguage } from ".././languageSelector/selectedLanguageSlice";

function randomLargeInt() {
  return Math.floor(Math.random() * 1000000000);
}

// The Authenticator component does not seem to reliably get re-rendered when amplifyI18n.setLanguage
// gets called.  So, let's break a rule and force update when it does:

export default function ScoreBridgeAuthenticator() {
  const langCode = useAppSelector(selectLanguage);
  const [forceRerenderKey, setForceRerenderKey] = useState(randomLargeInt());
  useEffect(() => {
    amplifyI18n.setLanguage(langCode);
    setForceRerenderKey(randomLargeInt());
  }, [langCode]);
  return (
    <Authenticator key={forceRerenderKey} hideSignUp={true}>
      {({ /* signOut, */ user }) => (
        <>
          <p>
            You are now signed in, either as an adminSuper or in a non-prod env.
            Here are your user details:
          </p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </Authenticator>
  );
}
