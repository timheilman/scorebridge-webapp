import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../scorebridge-ts-submodule/useClubId";
import {
  allSubscriptionsI,
  selectSubscriptionById,
} from "../subscriptions/subscriptionsSlice";

export interface SubscriptionResultParams {
  subscriptionId: keyof allSubscriptionsI;
}
export default function SubscriptionResult({
  subscriptionId,
}: SubscriptionResultParams) {
  const clubId = useClubId();
  const subsStatus = useAppSelector(selectSubscriptionById(subscriptionId));
  return (
    <li>
      Subscription: {subscriptionId}; status: {subsStatus}; clubId: {clubId}
    </li>
  );
}
