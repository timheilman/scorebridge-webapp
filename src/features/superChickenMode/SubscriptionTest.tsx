import { useAppSelector } from "../../app/hooks";
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
  const subsStatus = useAppSelector(selectSubscriptionById(subscriptionId));
  return (
    <li>
      Status of subscription {subscriptionId} is {subsStatus}
    </li>
  );
}
