import { GraphQLSubscription } from "@aws-amplify/api";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { API, graphqlOperation, Hub } from "aws-amplify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AuthMode } from "./authMode";
import { Club, ClubDevice } from "./graphql/appsync";
import {
  allSubscriptionsI,
  setSubscriptionStatus,
  subIdToSubGql,
} from "./subscriptionStatesSlice";

const pool: Record<string, unknown> = {};

export type SUBSCRIPTION_CALLBACK_TYPE<T extends keyof allSubscriptionsI> =
  T extends "createdClubDevice"
    ? { createdClubDevice: ClubDevice }
    : T extends "updatedClubDevice"
    ? { updatedClubDevice: ClubDevice }
    : T extends "deletedClubDevice"
    ? { deletedClubDevice: ClubDevice }
    : T extends "updatedClub"
    ? { updatedClub: Club }
    : never;

export interface AccessParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any;
  clubId: string;
  clubDeviceId?: string;
  authMode?: AuthMode;
}

export interface SubscriptionParams<T extends keyof allSubscriptionsI> {
  subId: T;
  callback: (arg0: SUBSCRIPTION_CALLBACK_TYPE<T>) => void;

  clubIdVarName?: string;
}

export type TypedSubscriptionParams<T extends keyof allSubscriptionsI> =
  AccessParams & SubscriptionParams<T>;

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

// unfortunately there's a lot to do for type safety and shortcuts are taken within
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
export const typedSubscription = <T extends keyof allSubscriptionsI>({
  subId,
  clubId,
  clubDeviceId,
  callback,
  dispatch,
  clubIdVarName,
  authMode,
}: TypedSubscriptionParams<T>) => {
  try {
    deleteSub(dispatch, subId);
    const variables: Record<string, unknown> = {};
    variables[clubIdVarName || "clubId"] = clubId;
    if (clubDeviceId) {
      variables["clubDeviceId"] = clubDeviceId;
    }

    const gql = subIdToSubGql[subId];
    console.log(`*** vars are ${JSON.stringify(variables)}`);
    pool[subId] = API.graphql<
      GraphQLSubscription<SUBSCRIPTION_CALLBACK_TYPE<typeof subId>>
    >({
      authMode: authMode || "AMAZON_COGNITO_USER_POOLS",
      ...graphqlOperation(gql, variables),
    }).subscribe({
      next: (data: any) => {
        callback(data.value.data);
      },
      error: (e) => {
        dispatch(
          setSubscriptionStatus([
            subId,
            `failed post-initialization: ${e.error.errors[0].message}`,
          ]),
        );
      },
    });
    dispatch(setSubscriptionStatus([subId, "successfullySubscribed"]));
  } catch (e: any) {
    if (e.message) {
      dispatch(
        setSubscriptionStatus([
          subId,
          `failed at initialization: ${e.message}`,
        ]),
      );
    } else {
      dispatch(
        setSubscriptionStatus([subId, `failed at initialization: ${e}`]),
      );
    }
    return;
  }
};

const deleteSub = (dispatch: any, subId: keyof allSubscriptionsI) => {
  if (pool[subId]) {
    // @ts-ignore
    pool[subId].unsubscribe();
    delete pool[subId];
    dispatch(setSubscriptionStatus([subId, "disconnected"]));
    return true;
  }
};
export const deleteAllSubs = (dispatch: any) => {
  Object.keys(subIdToSubGql).forEach((subId: string) => {
    deleteSub(dispatch, subId as keyof allSubscriptionsI /* actually safe */);
  });
};

export interface UseSubscriptionsParams {
  clubId: string;
  clubDeviceId?: string;
  subscribeToAll: (ap: AccessParams) => void;
  fetchRecentData: (ap: AccessParams) => Promise<void>;
  clearFetchedData: () => void;
  authMode?: AuthMode;
}
export function useSubscriptions({
  clubId,
  clubDeviceId,
  subscribeToAll,
  fetchRecentData,
  clearFetchedData,
  authMode,
}: UseSubscriptionsParams) {
  const dispatch = useDispatch();

  useEffect(() => {
    let priorConnectionState: ConnectionState;
    subscribeToAll({ dispatch, clubId, clubDeviceId, authMode });

    const stopListening = Hub.listen("api", (data: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          void fetchRecentData({ dispatch, clubId, clubDeviceId, authMode });
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        priorConnectionState = payload.data.connectionState;
      }
    });
    return () => {
      deleteAllSubs(dispatch);
      if (clearFetchedData) {
        clearFetchedData();
      }
      stopListening();
    };
  }, [
    authMode,
    clearFetchedData,
    clubDeviceId,
    clubId,
    dispatch,
    fetchRecentData,
    subscribeToAll,
  ]);
}

/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
