import { GraphQLSubscription } from "@aws-amplify/api";
import { AuthStatus } from "@aws-amplify/ui";
import { API, graphqlOperation } from "aws-amplify";

import { logFn } from "../../lib/logging";
import {
  allSubscriptionsI,
  setSubscriptionStatus,
  subIdToSubGql,
} from "./subscriptionsSlice";
const log = logFn("src.features.subscriptions.SubscriptionLifecycle.");
export const subscribeTo = <OUT>(
  authStatus: AuthStatus,
  subscriptions: Record<string, unknown>,
  subId: keyof allSubscriptionsI,

  subVars: Record<string, unknown>,
  dispatch: any,
  callback: (res: OUT) => void,
  errCallback: (e: unknown) => void,
) => {
  if (!subscriptions[subId]) {
    subscriptions[subId] = API.graphql<GraphQLSubscription<OUT>>({
      authMode:
        authStatus === "authenticated"
          ? "AMAZON_COGNITO_USER_POOLS"
          : "API_KEY",
      ...graphqlOperation(subIdToSubGql[subId], subVars),
    }).subscribe({
      next: (data) => {
        if (!data.value?.data) {
          log("subscribeTo.noData", "error", { data });
          return;
        }
        log("subScribeTo.end.success", "info", { data });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback(data.value.data);
      },
      error: (e) => {
        errCallback(e);
      },
    });
  }
};
export const deleteSub = (
  subscriptions: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any,
  subId: keyof allSubscriptionsI,
) => {
  if (subscriptions[subId]) {
    log("deleteSub.foundSubId", "debug", { subId });
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    subscriptions[subId].unsubscribe();
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    delete subscriptions[subId];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    dispatch(setSubscriptionStatus([subId, "disconnected"]));
  }
  log("deleteSub.noSuchSubId", "debug", { subId });
};
