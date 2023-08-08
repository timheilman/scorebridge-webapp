import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectLanguage } from "../selectedLanguage/selectedLanguageSlice";
import styles from "./ScoreBridgeAuthenticator.module.css";

function randomLargeInt() {
  return Math.floor(Math.random() * 1000000000);
}

// The Authenticator component does not seem to reliably get re-rendered when amplifyI18n.setLanguage
// gets called.  So, let's break a rule and force update when it does:

export function ScoreBridgeAuthenticator() {
  const langCode = useAppSelector(selectLanguage);
  const [forceRerenderKey, setForceRerenderKey] = useState(randomLargeInt());
  useEffect(() => {
    amplifyI18n.setLanguage(langCode);
    setForceRerenderKey(randomLargeInt());
  }, [langCode]);
  return (
    <div>
      <Authenticator
        key={forceRerenderKey}
        hideSignUp={true}
        className={styles.myFirstCssClass}
      >
        {({ signOut, user }) => (
          <>
            <p>contrived dependency within Authenticator</p>
            <p>{langCode}</p>
            <p>
              OMG a user: <pre>{JSON.stringify(user, null, 2)}</pre>
              And signout:
              <button onClick={signOut}>Sign Out</button>
            </p>
          </>
        )}
      </Authenticator>
    </div>
  );
}
