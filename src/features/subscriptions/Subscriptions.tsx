import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";

import { Club, ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  deleteAllSubs,
  typedSubscription,
} from "../../scorebridge-ts-submodule/subscriptions";
import {
  deleteClubDevice,
  insertClubDevice,
  setClub,
  setClubDevices,
} from "../clubDevices/clubDevicesSlice";

const log = logFn("src.features.subscriptions.Subscriptions.");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (
  clubId: string,
  dispatch: any,
  authStatus: AuthStatus,
) => {
  const promises: Promise<unknown>[] = [];
  // Retrieve some/all data from AppSync
  promises.push(
    gqlMutation<ListClubDevicesOutput>(
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
    }),
  );
  promises.push(
    gqlMutation<Club>(
      authStatus,
      gql`
        query getClub($clubId: String!) {
          getClub(clubId: $clubId) {
            id
            name
            createdAt
            updatedAt
          }
        }
      `,
      {
        clubId,
      },
    ).then((res) => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors, null, 2));
      }
      log("fetchRecentData.dispatchingSetClub", "debug", { res });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(setClub(res.data.getClub as Club));
    }),
  );
  await Promise.all(promises);
};
export interface SubscriptionsParams {
  clubId: string;
}

function subscribeAndFetch(
  clubId: string,
  appDispatch: any,
  authStatus: "configuring" | "authenticated" | "unauthenticated",
) {
  log("hubListen.connected", "debug");
  typedSubscription<{ createdClubDevice: ClubDevice }>({
    subId: "createdClubDevice",
    clubId,
    callback: (res) => {
      appDispatch(insertClubDevice(res.createdClubDevice));
    },
    appDispatch,
  });
  typedSubscription<{ deletedClubDevice: ClubDevice }>({
    subId: "deletedClubDevice",
    clubId,
    callback: (res) => {
      appDispatch(deleteClubDevice(res.deletedClubDevice.clubDeviceId));
    },
    appDispatch,
  });
  typedSubscription<{ updatedClub: Club }>({
    subId: "updatedClub",
    clubId,
    callback: (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      appDispatch(setClub(res.updatedClub));
    },
    clubIdVarName: "id",
    appDispatch,
  });

  void lcd(
    fetchRecentData(clubId, appDispatch, authStatus),
    "hubListen.subscribeAndFetch",
  );
}

export default function Subscriptions({ clubId }: SubscriptionsParams) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    log("hubListen.api.beforestart", "error");
    subscribeAndFetch(clubId, appDispatch, authStatus);

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
            fetchRecentData(clubId, appDispatch, authStatus),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "error", { payload });
      }
    });
    return () => {
      deleteAllSubs(appDispatch);
      appDispatch(setClubDevices({}));
      stopListening();
    };
  }, [authStatus, clubId, appDispatch]);
  return <></>;
}
