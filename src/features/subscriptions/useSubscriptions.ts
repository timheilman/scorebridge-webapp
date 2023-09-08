import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Club, ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { AuthMode } from "../../scorebridge-ts-submodule/authMode";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  AccessParams,
  deleteAllSubs,
  SUBSCRIPTION_CALLBACK_TYPE,
  typedSubscription,
  TypedSubscriptionParams,
} from "../../scorebridge-ts-submodule/subscriptions";
import { allSubscriptionsI } from "../../scorebridge-ts-submodule/subscriptionStatesSlice";
import {
  deleteClubDevice,
  insertClubDevice,
  setClub,
  setClubDevices,
} from "../clubDevices/clubDevicesSlice";

const log = logFn("src.features.subscriptions.Subscriptions.");

// ignoring that log's type cannot have its argument restricted to true logLevel strings,
// because logLevel is not part of shared (yet)
/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

export const generateTypedSubscription = <T extends keyof allSubscriptionsI>(
  ap: AccessParams,
  subId: T,
  callback: (res: SUBSCRIPTION_CALLBACK_TYPE<T>) => void,
  clubIdVarName?: string,
) => {
  const subscriptionParams: TypedSubscriptionParams<T> = {
    subId,
    callback,
    clubIdVarName,
    ...ap,
  };
  typedSubscription(subscriptionParams);
};

const fetchRecentData = async ({
  dispatch,
  clubId,
  authMode,
}: AccessParams) => {
  const promises: Promise<unknown>[] = [];
  // Retrieve some/all data from AppSync
  const listClubDevicesGql = gql`
    query listClubDevices($input: ListClubDevicesInput!) {
      listClubDevices(input: $input) {
        clubDevices {
          clubDeviceId
          name
          table
        }
      }
    }
  `;
  promises.push(
    gqlMutation<ListClubDevicesOutput>(listClubDevicesGql, {
      input: { clubId },
      authMode,
    }).then((res) => {
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
      // @ts-ignore
      dispatch(setClub(res.data.getClub as Club));
    }),
  );
  await Promise.all(promises);
};

function subscribeToAll(accessParams: AccessParams) {
  log("subscribeToAll", "debug");

  generateTypedSubscription(accessParams, "createdClubDevice", (res) => {
    accessParams.dispatch(insertClubDevice(res.createdClubDevice));
  });

  generateTypedSubscription(accessParams, "deletedClubDevice", (res) => {
    accessParams.dispatch(deleteClubDevice(res.deletedClubDevice.clubDeviceId));
  });

  generateTypedSubscription(
    accessParams,
    "updatedClub",
    (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      accessParams.dispatch(setClub(res.updatedClub));
    },
    "id",
  );
  log("doneSubscribing", "debug");
}

export default function useSubscriptions(clubId: string, authMode?: AuthMode) {
  const dispatch = useDispatch();

  useEffect(() => {
    log("useEffect", "debug");
    let priorConnectionState: ConnectionState;
    subscribeToAll({ dispatch, clubId, authMode });

    const stopListening = Hub.listen("api", (data: any) => {
      log("hubListen", "debug", { data });
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          void lcd(
            fetchRecentData({ dispatch, clubId, authMode }),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "debug", { payload });
      }
    });
    return () => {
      deleteAllSubs(dispatch);
      dispatch(setClubDevices({}));
      stopListening();
    };
  }, [authMode, clubId, dispatch]);
}
/* eslint-enable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
