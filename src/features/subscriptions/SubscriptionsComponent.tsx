import { GraphQLSubscription } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

import { Club, ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { AuthMode } from "../../scorebridge-ts-submodule/authMode";
import { retryPromise } from "../../scorebridge-ts-submodule/retryPromise";
import {
  AccessParams,
  deleteSub,
  handleAmplifySubscriptionError,
  handleUnexpectedSubscriptionError,
  pool,
  SUBSCRIPTION_CALLBACK_TYPE,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/subscriptions";
import {
  setSubscriptionBirth,
  setSubscriptionStatus,
  subIdToSubGql,
} from "../../scorebridge-ts-submodule/subscriptionStatesSlice";
import {
  deleteClubDevice,
  setClub,
  setClubDevices,
  upsertClubDevice,
} from "../clubDevices/clubDevicesSlice";
import { getClubGql } from "./gql/getClub";
import { listClubDevicesGql } from "./gql/listClubDevices";

const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
  authMode: AuthMode;
}

function listClubDevices({ clubId, authMode, dispatch }: AccessParams) {
  return gqlMutation<ListClubDevicesOutput>(listClubDevicesGql, {
    input: { clubId },
    authMode,
  }).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
    /* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access */
    // @ts-ignore
    const d = res.data.listClubDevices.clubDevices as ClubDevice[];
    /* eslint-enable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access */
    // TODO: handle nextToken etc...
    log("dispatchingSetClubDevices", "debug", { res });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    dispatch(
      setClubDevices(
        d.reduce<Record<string, ClubDevice>>((acc, cd) => {
          acc[cd.clubDeviceId] = cd;
          return acc;
        }, {}),
      ),
    );
  });
}

function getClub({ clubId, authMode, dispatch }: AccessParams) {
  return gqlMutation<Club>(
    getClubGql,
    {
      clubId,
    },
    authMode,
  ).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
    log("fetchRecentData.dispatchingSetClub", "debug", { res });
    /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
    // @ts-ignore
    dispatch(setClub(res.data.getClub as Club));
    /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
  });
}

export function SubscriptionsComponent({
  clubId,
  authMode,
}: SubscriptionComponentParams) {
  const dispatch = useAppDispatch();

  function subscribeToAll(accessParams: AccessParams) {
    log("subscribeToAll", "debug");

    try {
      deleteSub(accessParams.dispatch, "createdClubDevice");
      const variables: Record<string, unknown> = {};
      variables.clubId = accessParams.clubId;
      if (accessParams.clubDeviceId) {
        variables.clubDeviceId = accessParams.clubDeviceId;
      }

      const gql = subIdToSubGql.createdClubDevice;
      log("createdClubDevice.typedSubscription", "debug", variables);
      pool.createdClubDevice = API.graphql<
        GraphQLSubscription<SUBSCRIPTION_CALLBACK_TYPE<"createdClubDevice">>
      >({
        authMode: accessParams.authMode || "AMAZON_COGNITO_USER_POOLS",
        ...graphqlOperation(gql, variables),
      }).subscribe({
        next: (data: any) =>
          accessParams.dispatch(
            upsertClubDevice(data.value.data.createdClubDevice),
          ),
        error: handleAmplifySubscriptionError(
          accessParams.dispatch,
          "createdClubDevice",
        ),
      });
      log("createdClubDevice.typedSubscription.success", "debug", {
        subId: "createdClubDevice",
      });
      accessParams.dispatch(
        setSubscriptionStatus(["createdClubDevice", "successfullySubscribed"]),
      );
      log("createdClubDevice.typedSubscription.success.birth", "debug", {
        subId: "createdClubDevice",
      });
      accessParams.dispatch(setSubscriptionBirth("createdClubDevice"));
    } catch (e: any) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "createdClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "updatedClubDevice");
      const variables: Record<string, unknown> = {};
      variables.clubId = accessParams.clubId;
      if (accessParams.clubDeviceId) {
        variables.clubDeviceId = accessParams.clubDeviceId;
      }

      const gql = subIdToSubGql.updatedClubDevice;
      log("updatedClubDevice.typedSubscription", "debug", variables);
      pool.updatedClubDevice = API.graphql<
        GraphQLSubscription<SUBSCRIPTION_CALLBACK_TYPE<"updatedClubDevice">>
      >({
        authMode: accessParams.authMode || "AMAZON_COGNITO_USER_POOLS",
        ...graphqlOperation(gql, variables),
      }).subscribe({
        next: (data: any) =>
          accessParams.dispatch(
            upsertClubDevice(data.value.data.updatedClubDevice),
          ),
        error: handleAmplifySubscriptionError(
          accessParams.dispatch,
          "updatedClubDevice",
        ),
      });
      log("updatedClubDevice.typedSubscription.success", "debug", {
        subId: "updatedClubDevice",
      });
      accessParams.dispatch(
        setSubscriptionStatus(["updatedClubDevice", "successfullySubscribed"]),
      );
      log("updatedClubDevice.typedSubscription.success.birth", "debug", {
        subId: "updatedClubDevice",
      });
      accessParams.dispatch(setSubscriptionBirth("updatedClubDevice"));
    } catch (e: any) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "updatedClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "deletedClubDevice");
      const variables: Record<string, unknown> = {};
      variables.clubId = accessParams.clubId;
      if (accessParams.clubDeviceId) {
        variables.clubDeviceId = accessParams.clubDeviceId;
      }

      const gql = subIdToSubGql.deletedClubDevice;
      log("deletedClubDevice.typedSubscription", "debug", variables);
      pool.deletedClubDevice = API.graphql<
        GraphQLSubscription<SUBSCRIPTION_CALLBACK_TYPE<"deletedClubDevice">>
      >({
        authMode: accessParams.authMode || "AMAZON_COGNITO_USER_POOLS",
        ...graphqlOperation(gql, variables),
      }).subscribe({
        next: (data: any) =>
          accessParams.dispatch(
            deleteClubDevice(data.value.data.deletedClubDevice.clubDeviceId),
          ),
        error: handleAmplifySubscriptionError(
          accessParams.dispatch,
          "deletedClubDevice",
        ),
      });
      log("deletedClubDevice.typedSubscription.success", "debug", {
        subId: "deletedClubDevice",
      });
      accessParams.dispatch(
        setSubscriptionStatus(["deletedClubDevice", "successfullySubscribed"]),
      );
      log("deletedClubDevice.typedSubscription.success.birth", "debug", {
        subId: "deletedClubDevice",
      });
      accessParams.dispatch(setSubscriptionBirth("deletedClubDevice"));
    } catch (e: any) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "deletedClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "updatedClub");
      const variables: Record<string, unknown> = {};
      variables.id = accessParams.clubId;

      const gql = subIdToSubGql.updatedClub;
      log("updatedClub.typedSubscription", "debug", variables);
      pool.updatedClub = API.graphql<
        GraphQLSubscription<SUBSCRIPTION_CALLBACK_TYPE<"updatedClub">>
      >({
        authMode: accessParams.authMode || "AMAZON_COGNITO_USER_POOLS",
        ...graphqlOperation(gql, variables),
      }).subscribe({
        next: (data: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          accessParams.dispatch(setClub(data.value.data.updatedClub));
        },
        error: handleAmplifySubscriptionError(
          accessParams.dispatch,
          "updatedClub",
        ),
      });
      log("updatedClub.typedSubscription.success", "debug", {
        subId: "updatedClub",
      });
      accessParams.dispatch(
        setSubscriptionStatus(["updatedClub", "successfullySubscribed"]),
      );
      log("updatedClub.typedSubscription.success.birth", "debug", {
        subId: "updatedClub",
      });
      accessParams.dispatch(setSubscriptionBirth("updatedClub"));
    } catch (e: any) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "updatedClub",
      );
    }
    log("doneSubscribing", "debug");
  }

  const fetchRecentData = async (accessParams: AccessParams) => {
    const promises: Promise<unknown>[] = [];
    // Retrieve some/all data from AppSync
    // these must be retried because sometimes after an internet outage the
    // subscriptions will become healthy again before domain-name-service is
    // ready, so the initial refetch of data will fail
    promises.push(retryPromise(() => listClubDevices(accessParams)));
    promises.push(retryPromise(() => getClub(accessParams)));
    await Promise.all(promises);
  };

  useSubscriptions({
    clubId,
    subscribeToAll,
    fetchRecentData,
    clearFetchedData: () => {
      dispatch(setClubDevices({}));
      dispatch(setClub(null));
    },
    authMode,
  });

  return <></>;
}
