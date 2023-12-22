import "./App.css";

import {
  translations as amplifyUiReactTranslations,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import { I18n as amplifyI18n } from "aws-amplify";
import { Trans, useTranslation } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

import ScoreBridgeRoutes from "./features/header/ScoreBridgeRoutes";
import SessionfulRouterHeader from "./features/header/SessionfulRouterHeader";
import SessionlessRouterHeader from "./features/header/SessionlessRouterHeader";
import requiredViteEnvVar from "./lib/requiredViteEnvVar";
import TypesafeTranslationT from "./scorebridge-ts-submodule/TypesafeTranslationT";

// TODO: customize the Authenticator component to use our own i18n w/these translations and remove this:
amplifyI18n.putVocabularies(amplifyUiReactTranslations);

// custom components, good idea for use case:
// function StatusBar() {
//   const isOnline = useOnlineStatus();
//   return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
// }

// const createSub = API.graphql<GraphQLSubscription<OnCreateTodoSubscription>>(
//   graphqlOperation(subscriptions.onCreateTodo)
// ).subscribe({
//   next: data => // Process incoming messages
// });
//
// const updateSub = API.graphql<GraphQLSubscription<OnUpdateTodoSubscription>>(
//   graphqlOperation(subscriptions.onUpdateTodo)
// ).subscribe({
//   next: data => // Process incoming messages
// });
//
// const deleteSub = API.graphql<GraphQLSubscription<OnDeleteTodoSubscription>>(
//   graphqlOperation(subscriptions.onDeleteTodo)
// ).subscribe({
//   next: data => // Process incoming messages
// });
//
// const cleanupSubscriptions = () => {
//   createSub.unsubscribe();
//   updateSub.unsubscribe();
//   deleteSub.unsubscribe();
// }

export default function App() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const t = useTranslation("translation").t as TypesafeTranslationT;
  if (authStatus === "configuring") {
    return <Trans>Loading user session</Trans>;
  }
  const stage = requiredViteEnvVar("STAGE");

  return (
    <>
      <h2>
        {t("appTitle")}
        {stage === "prod" ? "" : `-${stage}`}
      </h2>
      <Router>
        {authStatus === "authenticated" ? (
          <SessionfulRouterHeader />
        ) : (
          <SessionlessRouterHeader />
        )}
        <div className="container">
          <ScoreBridgeRoutes />
        </div>
      </Router>
    </>
  );
}
