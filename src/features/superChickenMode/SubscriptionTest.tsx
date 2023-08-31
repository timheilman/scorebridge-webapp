import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import {
  allSubscriptionsI,
  selectSubscriptionById,
} from "../subscriptions/subscriptionsSlice";

export interface SubscriptionTestParams {
  subscriptionId: keyof allSubscriptionsI;
}
export default function SubscriptionTest({
  subscriptionId,
}: SubscriptionTestParams) {
  const clubId = useClubId();
  const subsStatus = useAppSelector(selectSubscriptionById(subscriptionId));
  return (
    <li>
      Subscription: {subscriptionId}; status: {subsStatus}; clubId: {clubId}
    </li>
  );
}
