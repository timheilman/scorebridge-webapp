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
