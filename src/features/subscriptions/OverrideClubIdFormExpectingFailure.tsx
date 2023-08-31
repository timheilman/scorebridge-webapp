import { useEffect } from "react";

import { ClubDevice } from "../../../appsync";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { subscribeTo } from "./SubscriptionLifecycle";
import { allSubscriptionsI, selectFailingClubId } from "./subscriptionsSlice";

export interface OverrideClubIdFormExpectingFailureParams {
  subscriptionId: keyof allSubscriptionsI;
}
export default function OverrideClubIdFormExpectingFailure({
  subscriptionId,
}: OverrideClubIdFormExpectingFailureParams) {
  const failingClubId = useAppSelector(selectFailingClubId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const pool: Record<string, unknown> = {};
    subscribeTo<Record<string, ClubDevice>>(
      pool,
      subscriptionId,
      { clubId: failingClubId },
      dispatch,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_res) => {
        throw new Error(
          "should be unreachable, since subscription failure is expected instead",
        );
      },
    );
  }, [failingClubId, dispatch, subscriptionId]);
  return null;
}
