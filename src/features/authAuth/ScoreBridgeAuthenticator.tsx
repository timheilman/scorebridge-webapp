import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";

export function ScoreBridgeAuthenticator() {
  return (
    <Authenticator hideSignUp={true}>
      {({ signOut, user }) => (
        <p>
          OMG a user: <pre>{JSON.stringify(user, null, 2)}</pre>
          And signout:
          <button onClick={signOut}>Sign Out</button>
        </p>
      )}
    </Authenticator>
  );
}
