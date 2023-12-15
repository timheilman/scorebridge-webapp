// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FeatherIcon from "feather-icons-react";

import { useAppSelector } from "../../app/hooks";
import {
  selectSubscriptionStates,
  SubscriptionStateType,
} from "../../scorebridge-ts-submodule/subscriptionStatesSlice";

export default function OnlineStatus() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const subscriptionsStates: SubscriptionStateType = useAppSelector(
    selectSubscriptionStates,
  );
  if (
    Object.entries(subscriptionsStates).every((arrElt) => {
      return arrElt[1][1] === "successfullySubscribed";
    })
  ) {
    return <FeatherIcon icon="wifi" />;
  } else {
    return <FeatherIcon icon="wifi-off" />;
  }
}
