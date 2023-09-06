import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";

import { Club, ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  AuthModeType,
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
  authMode?: AuthModeType,
) => {
  const promises: Promise<unknown>[] = [];
  // Retrieve some/all data from AppSync
  promises.push(
    gqlMutation<ListClubDevicesOutput>(
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
      authMode,
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
      authMode,
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
  authMode?: AuthModeType;
}

function subscribeAndFetch(
  clubId: string,
  appDispatch: any,
  authMode?: AuthModeType,
) {
  log("hubListen.connected", "debug");
  typedSubscription({
    subId: "createdClubDevice",
    clubId,
    callback: (res) => {
      appDispatch(insertClubDevice(res.createdClubDevice));
    },
    appDispatch,
    authMode,
  });
  typedSubscription({
    subId: "deletedClubDevice",
    clubId,
    callback: (res) => {
      appDispatch(deleteClubDevice(res.deletedClubDevice.clubDeviceId));
    },
    appDispatch,
    authMode,
  });
  typedSubscription({
    subId: "updatedClub",
    clubId,
    callback: (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      appDispatch(setClub(res.updatedClub));
    },
    clubIdVarName: "id",
    appDispatch,
    authMode,
  });

  void lcd(
    fetchRecentData(clubId, appDispatch, authMode),
    "hubListen.subscribeAndFetch",
  );
}

export default function Subscriptions({
  clubId,
  authMode,
}: SubscriptionsParams) {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    log("hubListen.api.beforestart", "error");
    subscribeAndFetch(clubId, appDispatch, authMode);

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
            fetchRecentData(clubId, appDispatch, authMode),
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
  }, [authMode, clubId, appDispatch]);
  return <></>;
}
