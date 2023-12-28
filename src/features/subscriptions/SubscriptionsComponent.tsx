import { useAppDispatch } from "../../app/hooks";
import { client } from "../../gql";
import { logFn } from "../../lib/logging";
import { ClubDevice } from "../../scorebridge-ts-submodule/graphql/appsync";
import {
  getClubGql,
  listClubDevicesGql,
} from "../../scorebridge-ts-submodule/graphql/queries";
import { retryPromise } from "../../scorebridge-ts-submodule/retryPromise";
import {
  AccessParams,
  deleteSub,
  GraphQLAuthMode,
  handleAmplifySubscriptionError,
  handleUnexpectedSubscriptionError,
  pool,
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

const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
  authMode: GraphQLAuthMode;
}

function listClubDevices({ clubId, authMode, dispatch }: AccessParams) {
  return client
    .graphql({
      query: listClubDevicesGql,
      variables: {
        input: { clubId },
      },
      authMode,
    })
    .then((res) => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors, null, 2));
      }
      // TODO: SCOR-143 search for SCOR-143 and cleanup comments
      // SCOR-143
      // in cloud, we're using DynamoDBQueryRequest to fulfill this request,
      // and we'd rather not go to lambda for it. My old way, this resulted
      // in res.data.listClubDevices.clubDevices holding the result. However,
      // the @model flavor when using amplify for the backend in the tutorial
      // instead integrates with the Amplify v6 TypeScript Type systems to
      // involve the "ModelTodoConnection" __typename and "items" rather than
      // "clubDevices"; this then uses PagedList<ClubDevice>. I thus needed
      // to remove the translation from "items" to "clubDevices" over in cloud,
      // which seemed to imply I just return the whole ctx.result as-is; see
      // cloud's mapping-templates-ts/Query.listClubDevices.ts for more info.
      const d = res.data.listClubDevices.items;
      // TODO: handle nextToken etc...
      log("dispatchingSetClubDevices", "debug", { res });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(
        setClubDevices(
          d.reduce(
            (acc, cd) => {
              if (cd) {
                acc[cd.clubDeviceId] = cd;
              }
              return acc;
            },
            {} as Record<string, ClubDevice>,
          ),
        ),
      );
    });
}

function getClub({ clubId, authMode, dispatch }: AccessParams) {
  return client
    .graphql({
      query: getClubGql,
      variables: {
        clubId,
      },
      authMode,
    })
    .then((res) => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors, null, 2));
      }
      log("fetchRecentData.dispatchingSetClub", "debug", { res });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(setClub(res.data.getClub!));
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
      deleteSub(accessParams.dispatch, "onCreateClubDevice");

      const variables = { clubId: accessParams.clubId };
      log("onCreateClubDevice.typedSubscription", "debug", variables);
      pool.onCreateClubDevice = client
        .graphql({
          authMode: accessParams.authMode ?? "userPool",
          query: subIdToSubGql.onCreateClubDevice,
          variables: variables,
        })
        .subscribe({
          next: (message) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
            accessParams.dispatch(
              upsertClubDevice(message.data.onCreateClubDevice),
            ),
          error: handleAmplifySubscriptionError(
            accessParams.dispatch,
            "onCreateClubDevice",
          ),
        });
      log("onCreateClubDevice.typedSubscription.success", "debug", {
        subId: "onCreateClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(
        setSubscriptionStatus(["onCreateClubDevice", "successfullySubscribed"]),
      );
      log("onCreateClubDevice.typedSubscription.success.birth", "debug", {
        subId: "onCreateClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(setSubscriptionBirth("onCreateClubDevice"));
    } catch (e: unknown) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "onCreateClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "onUpdateClubDevice");

      const variables = { clubId: accessParams.clubId };
      log("onUpdateClubDevice.typedSubscription", "debug", variables);
      pool.onUpdateClubDevice = client
        .graphql({
          authMode: accessParams.authMode ?? "userPool",
          query: subIdToSubGql.onUpdateClubDevice,
          variables: variables,
        })
        .subscribe({
          next: (message) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            accessParams.dispatch(
              upsertClubDevice(message.data.onUpdateClubDevice),
            ),
          error: handleAmplifySubscriptionError(
            accessParams.dispatch,
            "onUpdateClubDevice",
          ),
        });
      log("onUpdateClubDevice.typedSubscription.success", "debug", {
        subId: "onUpdateClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(
        setSubscriptionStatus(["onUpdateClubDevice", "successfullySubscribed"]),
      );
      log("onUpdateClubDevice.typedSubscription.success.birth", "debug", {
        subId: "onUpdateClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(setSubscriptionBirth("onUpdateClubDevice"));
    } catch (e: unknown) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "onUpdateClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "onDeleteClubDevice");
      const variables = { clubId: accessParams.clubId };

      log("onDeleteClubDevice.typedSubscription", "debug", variables);
      pool.onDeleteClubDevice = client
        .graphql({
          authMode: accessParams.authMode ?? "userPool",
          query: subIdToSubGql.onDeleteClubDevice,
          variables,
        })
        .subscribe({
          next: (message) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            accessParams.dispatch(
              // TODO: SCOR-143 differentiate that deleteClubDevice here is a redux directive, not gql directive
              deleteClubDevice(message.data.onDeleteClubDevice.clubDeviceId),
            ),
          error: handleAmplifySubscriptionError(
            accessParams.dispatch,
            "onDeleteClubDevice",
          ),
        });
      log("onDeleteClubDevice.typedSubscription.success", "debug", {
        subId: "onDeleteClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(
        setSubscriptionStatus(["onDeleteClubDevice", "successfullySubscribed"]),
      );
      log("onDeleteClubDevice.typedSubscription.success.birth", "debug", {
        subId: "onDeleteClubDevice",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(setSubscriptionBirth("onDeleteClubDevice"));
    } catch (e: unknown) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "onDeleteClubDevice",
      );
    }

    try {
      deleteSub(accessParams.dispatch, "onUpdateClub");
      const variables = { id: accessParams.clubId };

      const gql = subIdToSubGql.onUpdateClub;
      log("onUpdateClub.typedSubscription", "debug", variables);
      pool.onUpdateClub = client
        .graphql({
          authMode: accessParams.authMode ?? "userPool",
          query: gql,
          variables,
        })
        .subscribe({
          next: (message) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            accessParams.dispatch(setClub(message.data.onUpdateClub));
          },
          error: handleAmplifySubscriptionError(
            accessParams.dispatch,
            "onUpdateClub",
          ),
        });
      log("onUpdateClub.typedSubscription.success", "debug", {
        subId: "onUpdateClub",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(
        setSubscriptionStatus(["onUpdateClub", "successfullySubscribed"]),
      );
      log("onUpdateClub.typedSubscription.success.birth", "debug", {
        subId: "onUpdateClub",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(setSubscriptionBirth("onUpdateClub"));
    } catch (e: unknown) {
      handleUnexpectedSubscriptionError(
        e,
        accessParams.dispatch,
        "onUpdateClub",
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
