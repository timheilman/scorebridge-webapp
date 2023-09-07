import { AuthMode } from "../../scorebridge-ts-submodule/authMode";
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
