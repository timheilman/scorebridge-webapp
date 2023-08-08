import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectLanguage } from "../selectedLanguage/selectedLanguageSlice";

// The Authenticator component does not seem to reliably get re-rendered when amplifyI18n.setLanguage
// gets called.  So, let's break a rule and force update when it does:

export function ScoreBridgeAuthenticator() {
  const langCode = useAppSelector(selectLanguage);
  const [forceRerenderKey, setForceRerenderKey] = useState(
    new Date().toISOString(),
  );
  useEffect(() => {
    amplifyI18n.setLanguage(langCode);
    setForceRerenderKey(new Date().toISOString());
  }, [langCode]);
  return (
    <>
      <p>contrived dependency before Authenticator</p>
      <p>{langCode}</p>
      <Authenticator key={forceRerenderKey} hideSignUp={true}>
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
    </>
  );
}
