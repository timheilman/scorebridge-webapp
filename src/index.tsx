import "./index.css";
import "@aws-amplify/ui-react"; // TODO: can this be deleted?
import "./i18n";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify, Auth } from "aws-amplify";
import React from "react"; // this is the only place this import should be needed on v18 of react
import { createRoot } from "react-dom/client";
import { Provider as ReactReduxProvider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import requiredEnvVar from "./requiredEnvVar";

Amplify.configure({
  API: {
    graphql_headers: async () => {
      try {
        const session = await Auth.currentSession();
        return {
          Authorization: session.getIdToken().getJwtToken(),
        };
      } catch (e) {
        return {};
      }
    },
  },
  Auth: {
    region: requiredEnvVar("AWS_REGION"),
    userPoolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
    userPoolWebClientId: requiredEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"), // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  },
  aws_appsync_graphqlEndpoint: requiredEnvVar("API_URL"),
  aws_appsync_region: requiredEnvVar("AWS_REGION"),
  aws_appsync_apiKey: requiredEnvVar("ADD_CLUB_API_KEY"),
});

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
