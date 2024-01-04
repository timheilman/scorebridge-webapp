import { useAppDispatch } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import {
  ClubDevice,
  Maybe,
} from "../../scorebridge-ts-submodule/graphql/appsync";
import { listClubDevicesGql } from "../../scorebridge-ts-submodule/graphql/queries";
import { client } from "../../scorebridge-ts-submodule/react/gqlClient";
import {
  AccessParams,
  errorCatchingSubscription,
  getClub,
  GraphQLAuthMode,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/react/subscriptions";
import { subIdToSubGql } from "../../scorebridge-ts-submodule/react/subscriptionStatesSlice";
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
          d.reduce((acc: Record<string, ClubDevice>, cd: Maybe<ClubDevice>) => {
            if (cd) {
              acc[cd.clubDeviceId] = cd;
            }
            return acc;
          }, {}),
        ),
      );
    });
}

export function SubscriptionsComponent({
  clubId,
  authMode,
}: SubscriptionComponentParams) {
  const dispatch = useAppDispatch();

  function subscribeToAll(accessParams: AccessParams) {
    log("subscribeToAll", "debug");
    errorCatchingSubscription({
      accessParams,
      subId: "onCreateClubDevice",
      query: subIdToSubGql.onCreateClubDevice,
      variables: { clubId: accessParams.clubId },
      callback: (clubDevice) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(upsertClubDevice(clubDevice));
      },
    });
    errorCatchingSubscription({
      accessParams,
      subId: "onUpdateClubDevice",
      query: subIdToSubGql.onUpdateClubDevice,
      variables: { clubId: accessParams.clubId },
      callback: (clubDevice) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(upsertClubDevice(clubDevice));
      },
    });
    errorCatchingSubscription({
      accessParams,
      subId: "onDeleteClubDevice",
      query: subIdToSubGql.onDeleteClubDevice,
      variables: { clubId: accessParams.clubId },
      callback: (clubDevice) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(deleteClubDevice(clubDevice.clubDeviceId));
      },
    });
    errorCatchingSubscription({
      accessParams,
      subId: "onUpdateClub",
      query: subIdToSubGql.onUpdateClub,
      variables: { id: accessParams.clubId },
      callback: (club) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(setClub(club));
      },
    });

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
    promises.push(
      retryOnNetworkFailurePromise(() => getClub(accessParams, setClub)),
    );
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
