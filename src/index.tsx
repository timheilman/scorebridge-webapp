import "./index.css";
import "./i18n";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import React from "react"; // this is the only place this import should be needed on v18 of react
import { createRoot } from "react-dom/client";
import { Provider as ReactReduxProvider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import requiredViteEnvVar from "./lib/requiredViteEnvVar";
import reportWebVitals from "./reportWebVitals";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: requiredViteEnvVar("API_URL"),
        region: requiredViteEnvVar("AWS_REGION"),
        defaultAuthMode: "userPool",
        apiKey: requiredViteEnvVar("CREATE_CLUB_API_KEY"),
      },
    },
    Auth: {
      Cognito: {
        userPoolClientId: requiredViteEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"),
        userPoolId: requiredViteEnvVar("COGNITO_USER_POOL_ID"),
      },
    },
  },
  {
    API: {
      GraphQL: {
        headers: async () => {
          try {
            const session = await fetchAuthSession();
            return {
              Authorization: session?.tokens?.idToken?.toString(),
            };
          } catch (e) {
            return {};
          }
        },
      },
    },
  },
);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Cannot initialize react; no root element found.");
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReactReduxProvider store={store}>
      <Authenticator.Provider>
        <React.Suspense fallback="loading translations...">
          <App />
        </React.Suspense>
      </Authenticator.Provider>
    </ReactReduxProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
