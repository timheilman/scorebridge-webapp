import { GraphQLSubscription } from "@aws-amplify/api";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Hub } from "aws-amplify";
import { DocumentNode } from "graphql/language";
import gql from "graphql-tag";
import { useEffect } from "react";

import { ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import {
  subscriptionCreatedClubDevice,
  subscriptionDeletedClubDevice,
} from "../../graphql/subscriptions";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import {
  deleteClubDevice,
  insertClubDevice,
  setClubDevices,
} from "../clubDevices/clubDevicesSlice";
import { setSubscriptionStatus } from "./subscriptionsSlice";

const log = logFn("src.features.subscriptions.Subscriptions");

const subIdToSubGql: Record<string, DocumentNode> = {
  createdClubDevice: subscriptionCreatedClubDevice,
  deletedClubDevice: subscriptionDeletedClubDevice,
};

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (clubId: string, dispatch: any) => {
  // Retrieve some/all data from AppSync
  return gqlMutation<ListClubDevicesOutput>(
    "authenticated",
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
export default function Subscriptions() {
  const { user } = useAuthenticator((context) => [context.user]);
  const dispatch = useAppDispatch();
  const clubId = useClubId();
  useEffect(() => {
    const subscriptions: Record<string, unknown> = {};
    const subscribeTo = <OUT,>(
      subId: string,
      subGql: DocumentNode,
      subVars: Record<string, unknown>,
      callback: (res: OUT) => void,
    ) => {
      if (!subscriptions[subId]) {
        subscriptions[subId] = API.graphql<GraphQLSubscription<OUT>>({
          authMode: "AMAZON_COGNITO_USER_POOLS",
          ...graphqlOperation(subGql, subVars),
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
        });
      }
    };
    const deleteSub = (subId: string) => {
      if (subscriptions[subId]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        subscriptions[subId].unsubscribe();
        delete subscriptions[subId];
      }
    };
    let priorConnectionState: string;
    if (!clubId) {
      // sneaky sneaky superchickenmode w/superAdmin will not
      log("noClubId", "info", { user });
      return;
    }
    log("initialFetch", "debug");
    fetchRecentData(clubId, dispatch).catch((e) =>
      log("badInitialGqlQuery", "error", { e }),
    );
    Hub.listen("api", (data: any) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          log("refreshFetch", "debug");
          fetchRecentData(clubId, dispatch).catch((e) =>
            log("badRefreshGqlQuery", "error", { e }),
          );
        }
        priorConnectionState = payload.data.connectionState;
      }
    });
    const subs = <T,>(
      subId: string,
      clubId: string,
      callback: (arg0: T) => void,
    ) => {
      try {
        subscribeTo<T>(subId, subIdToSubGql[subId], { clubId }, callback);
      } catch (e: any) {
        if (e.message) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(setSubscriptionStatus([subId, `failed: ${e.message}`]));
        } else {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(setSubscriptionStatus([subId, `failed: ${e}`]));
        }
        return;
      }
      dispatch(setSubscriptionStatus([subId, "successfullySubscribed"]));
    };
    subs<{ createdClubDevice: ClubDevice }>(
      "createdClubDevice",
      clubId,
      (res) => {
        dispatch(insertClubDevice(res.createdClubDevice));
      },
    );
    subs<{ deletedClubDevice: ClubDevice }>(
      "deletedClubDevice",
      clubId,
      (res) => {
        dispatch(deleteClubDevice(res.deletedClubDevice.clubDeviceId));
      },
    );
    return () => {
      deleteSub("createdClubDevice");
      deleteSub("deletedClubDevice");
    };
  }, [clubId, dispatch, user]);
  return <></>;
}
