import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import { SubscriptionNames } from "../../scorebridge-ts-submodule/graphql/subscriptions";
import { selectSubscriptionStateById } from "../../scorebridge-ts-submodule/react/subscriptionStatesSlice";

export interface SubscriptionResultParams {
  subscriptionId: SubscriptionNames;
}
export default function SubscriptionResult({
  subscriptionId,
}: SubscriptionResultParams) {
  const clubId = useClubId();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const subsStatus = useAppSelector(
    selectSubscriptionStateById(subscriptionId),
  );
  return (
    <li>
      Subscription: {subscriptionId}; status: {subsStatus}; clubId: {clubId}
    </li>
  );
}
