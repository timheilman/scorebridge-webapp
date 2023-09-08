import { Club, ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { AuthMode } from "../../scorebridge-ts-submodule/authMode";
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
import { getClubGql } from "./gql/getClub";
import { listClubDevicesGql } from "./gql/listClubDevices";
const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
  authMode: AuthMode;
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

  const fetchRecentData = async ({
    dispatch,
    clubId,
    authMode,
  }: AccessParams) => {
    const promises: Promise<unknown>[] = [];
    // Retrieve some/all data from AppSync
    promises.push(
      gqlMutation<ListClubDevicesOutput>(listClubDevicesGql, {
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
      }),
    );
    promises.push(
      gqlMutation<Club>(
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
      }),
    );
    await Promise.all(promises);
  };

  useSubscriptions(
    clubId,
    subscribeToAll,
    fetchRecentData,
    () => {
      dispatch(setClubDevices({}));
      dispatch(setClub(null));
    },
    authMode,
  );
  return <></>;
}
