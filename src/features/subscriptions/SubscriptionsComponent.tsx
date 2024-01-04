import { useAppDispatch } from "../../app/hooks";
import { client } from "../../gql";
import { logFn } from "../../lib/logging";
import {
  ClubDevice,
  Subscription,
} from "../../scorebridge-ts-submodule/graphql/appsync";
import {
  getClubGql,
  listClubDevicesGql,
} from "../../scorebridge-ts-submodule/graphql/queries";
import {
  GeneratedSubscription,
  KeyedGeneratedSubscription,
  SubscriptionNames,
} from "../../scorebridge-ts-submodule/graphql/subscriptions";
import {
  AccessParams,
  deleteSub,
  GraphQLAuthMode,
  handleAmplifySubscriptionError,
  handleUnexpectedSubscriptionError,
  pool,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/react/subscriptions";
import {
  setSubscriptionBirth,
  setSubscriptionStatus,
  subIdToSubGql,
} from "../../scorebridge-ts-submodule/react/subscriptionStatesSlice";
import { retryOnNetworkFailurePromise } from "../../scorebridge-ts-submodule/retryOnNetworkFailurePromise";
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
      // log("dispatchingSetClubDevices", "debug", { res });
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
      // log("fetchRecentData.dispatchingSetClub", "debug", { res });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(setClub(res.data.getClub!));
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutType<T> = T extends GeneratedSubscription<any, infer OUT>
  ? NeverEmpty<OUT>
  : never;
type NeverEmpty<T> = {
  [K in keyof T]-?: Exclude<WithListsFixed<T[K]>, undefined | null>;
};
type WithListsFixed<T> = T extends PagedList<infer IT, infer NAME>
  ? PagedList<Exclude<IT, null | undefined>, NAME>
  : // eslint-disable-next-line @typescript-eslint/ban-types
    T extends {}
    ? {
        [K in keyof T]: WithListsFixed<T[K]>;
      }
    : T;
interface PagedList<T, TYPENAME> {
  __typename: TYPENAME;
  nextToken?: string | null | undefined;
  items: T[];
}

function extracted<NAME extends SubscriptionNames, IN>(
  accessParams: AccessParams,
  subId: NAME,
  gql: KeyedGeneratedSubscription<NAME, IN>,
  variables: IN,
  cb: (val: OutType<typeof gql>) => void,
) {
  try {
    deleteSub(accessParams.dispatch, subId);
    log("typedSubscription", "debug", {
      subscriptionName: subId,
      ...variables,
    });
    pool[subId] = client
      .graphql({
        authMode: accessParams.authMode ?? "userPool",
        query: gql,
        variables,
      })
      .subscribe({
        next: (message) => cb(message.data),
        error: handleAmplifySubscriptionError(accessParams.dispatch, subId),
      });
    log("typedSubscription.ok", "debug", { subId });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    accessParams.dispatch(
      setSubscriptionStatus([subId, "successfullySubscribed"]),
    );
    log("typedSubscription.birth", "debug", { subId });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    accessParams.dispatch(setSubscriptionBirth(subId));
  } catch (e: unknown) {
    handleUnexpectedSubscriptionError(e, accessParams.dispatch, subId);
  }
}

export function SubscriptionsComponent({
  clubId,
  authMode,
}: SubscriptionComponentParams) {
  const dispatch = useAppDispatch();

  function subscribeToAll(accessParams: AccessParams) {
    log("subscribeToAll", "debug");
    const cb = (message: Pick<Subscription, "onCreateClubDevice">) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(upsertClubDevice(message.onCreateClubDevice!));
    };

    const subId: SubscriptionNames = "onCreateClubDevice";
    const variables = { clubId: accessParams.clubId };
    extracted(accessParams, subId, subIdToSubGql[subId], variables, cb);

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
    promises.push(
      retryOnNetworkFailurePromise(() => listClubDevices(accessParams)),
    );
    promises.push(retryOnNetworkFailurePromise(() => getClub(accessParams)));
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
