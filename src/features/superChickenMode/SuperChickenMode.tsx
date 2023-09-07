import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import FallbackFormWhenNonAdminSuper from "../subscriptions/FallbackFormWhenNonAdminSuper";
import { selectFallbackClubId } from "../subscriptions/subscriptionsSlice";
import useSubscriptions from "../subscriptions/useSubscriptions";
import SubscriptionDisplayer from "./SubscriptionDisplayer";

export default function SuperChickenMode() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const clubId = useClubId();
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  useSubscriptions(clubId);
  const MaybeSubscriptions = () => {
    if (clubId) {
      return (
        <>
          <p>reinitializing subscriptions...</p>
        </>
      );
    } else if (authStatus !== "authenticated") {
      return (
        <p>clubId not yet 26 chars: {fallbackClubId.split("").join(",")}</p>
      );
    }
    return null;
  };
  return (
    <>
      <ScoreBridgeAuthenticator />
      <SignUpForm />
      <FallbackFormWhenNonAdminSuper />
      <MaybeSubscriptions />
      <SubscriptionDisplayer />
    </>
  );
}
