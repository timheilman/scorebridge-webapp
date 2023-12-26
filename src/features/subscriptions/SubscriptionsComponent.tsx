import { GraphQLAuthMode } from "@aws-amplify/core/internals/utils";

import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { ClubDevice } from "../../scorebridge-ts-submodule/graphql/appsync";
import {
  getClubGql,
  listClubDevicesGql,
} from "../../scorebridge-ts-submodule/graphql/queries";
import { retryPromise } from "../../scorebridge-ts-submodule/retryPromise";
import {
  AccessParams,
  generateTypedSubscription,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/subscriptions";
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
  return gqlMutation(
    listClubDevicesGql,
    {
      input: { clubId },
    },
    authMode,
  ).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
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
            acc[cd.clubDeviceId] = cd;
            return acc;
          },
          {} as Record<string, ClubDevice>,
        ),
      ),
    );
  });
}

function getClub({ clubId, authMode, dispatch }: AccessParams) {
  return gqlMutation(
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

    generateTypedSubscription(accessParams, "createdClubDevice", (res) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(upsertClubDevice(res.createdClubDevice));
    });

    generateTypedSubscription(accessParams, "updatedClubDevice", (res) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(upsertClubDevice(res.updatedClubDevice));
    });

    generateTypedSubscription(accessParams, "deletedClubDevice", (res) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(
        deleteClubDevice(res.deletedClubDevice.clubDeviceId),
      );
    });

    generateTypedSubscription(
      accessParams,
      "updatedClub",
      (res) => {
        log("typedSubscription.updatedClubCallback", "debug", { res });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(setClub(res.updatedClub));
      },
      "id",
    );
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
