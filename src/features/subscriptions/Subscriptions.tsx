import { GraphQLSubscription } from "@aws-amplify/api";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";

import { ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  deleteClubDevice,
  insertClubDevice,
  setClubDevices,
} from "../clubDevices/clubDevicesSlice";
import {
  allSubscriptionsI,
  setSubscriptionStatus,
  subIdToSubGql,
} from "./subscriptionsSlice";

const log = logFn("src.features.subscriptions.Subscriptions.");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

const deleteSub = (
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

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (
  clubId: string,
  dispatch: any,
  authStatus: AuthStatus,
) => {
  // Retrieve some/all data from AppSync
  return gqlMutation<ListClubDevicesOutput>(
    authStatus,
    gql`
      query listClubDevices($input: ListClubDevicesInput!) {
        listClubDevices(input: $input) {
          clubDevices {
            clubDeviceId
            name
            table
          }
        }
      }
    `,
    {
      input: { clubId },
    },
  ).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const d = res.data.listClubDevices.clubDevices as ClubDevice[];
    // TODO: handle nextToken etc...
    log("dispatchingSetClubDevices", "debug", { res });
    dispatch(
      setClubDevices(
        d.reduce<Record<string, ClubDevice>>((acc, cd) => {
          acc[cd.clubDeviceId] = cd;
          return acc;
        }, {}),
      ),
    );
  });
};
export interface SubscriptionsParams {
  clubId: string;
}

function subscribeAndFetch(
  typedSubscription: <T>(
    subId: keyof allSubscriptionsI,
    clubId: string,
    callback: (arg0: T) => void,
    errCallback: (arg0: unknown) => void,
  ) => void,
  clubId: string,
  dispatch: any,
  authStatus: "configuring" | "authenticated" | "unauthenticated",
) {
  log("hubListen.connected", "debug");
  typedSubscription<{ createdClubDevice: ClubDevice }>(
    "createdClubDevice",
    clubId,
    (res) => {
      dispatch(insertClubDevice(res.createdClubDevice));
    },
    (e: any) => {
      dispatch(
        setSubscriptionStatus([
          "createdClubDevice",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `failed post-initialization: ${e.error.errors[0].message}`,
        ]),
      );
    },
  );
  typedSubscription<{ deletedClubDevice: ClubDevice }>(
    "deletedClubDevice",
    clubId,
    (res) => {
      dispatch(deleteClubDevice(res.deletedClubDevice.clubDeviceId));
    },
    (e: any) => {
      dispatch(
        setSubscriptionStatus([
          "deletedClubDevice",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `failed post-initialization: ${e.error.errors[0].message}`,
        ]),
      );
    },
  );

  void lcd(
    fetchRecentData(clubId, dispatch, authStatus),
    "hubListen.subscribeAndFetch",
  );
}

export default function Subscriptions({ clubId }: SubscriptionsParams) {
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pool: Record<string, unknown> = {};

    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    const typedSubscription = <T,>(
      subId: keyof allSubscriptionsI,
      clubId: string,
      callback: (arg0: T) => void,
      errCallback: (arg0: unknown) => void,
    ) => {
      try {
        deleteSub(pool, dispatch, subId);
        log("subs.deletedAndSubscribingTo", "debug", { subId, clubId });
        if (!pool[subId]) {
          pool[subId] = API.graphql<GraphQLSubscription<T>>({
            authMode:
              authStatus === "authenticated"
                ? "AMAZON_COGNITO_USER_POOLS"
                : "API_KEY",
            ...graphqlOperation(subIdToSubGql[subId], { clubId }),
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
        dispatch(setSubscriptionStatus([subId, "successfullySubscribed"]));
      } catch (e: any) {
        if (e.message) {
          dispatch(
            setSubscriptionStatus([
              subId,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              `failed at initialization: ${e.message}`,
            ]),
          );
        } else {
          dispatch(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setSubscriptionStatus([subId, `failed at initialization: ${e}`]),
          );
        }
        return;
      }
    };
    log("hubListen.api.beforestart", "error");
    subscribeAndFetch(typedSubscription, clubId, dispatch, authStatus);

    log("hubListen.api.before", "error");
    const stopListening = Hub.listen("api", (data: any) => {
      // log("hubListen.api.callback", "error", { data });
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          void lcd(
            fetchRecentData(clubId, dispatch, authStatus),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "error", { payload });
      }
    });
    return () => {
      deleteSub(pool, dispatch, "createdClubDevice");
      deleteSub(pool, dispatch, "deletedClubDevice");
      dispatch(setClubDevices({}));
      stopListening();
    };
  }, [authStatus, clubId, dispatch, user]);
  return <></>;
}
