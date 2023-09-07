import { AuthMode } from "../../gql";
import useSubscriptions from "../subscriptions/useSubscriptions";
export interface SubscriptionComponentParams {
  clubId: string;
  authMode: AuthMode;
}
export function SubscriptionComponent({
  clubId,
  authMode,
}: SubscriptionComponentParams) {
  useSubscriptions(clubId, authMode);
  return <></>;
}
