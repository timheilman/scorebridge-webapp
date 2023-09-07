import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import { selectFallbackClubId } from "../subscriptions/subscriptionsSlice";
import FallbackFormWhenNonAdminSuper from "./FallbackFormWhenNonAdminSuper";
import { SubscriptionComponent } from "./SubscriptionComponent";
import SubscriptionDisplayer from "./SubscriptionDisplayer";

export default function SuperChickenMode() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const clubId = useClubId();
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  const MaybeSubscriptions = () => {
    if (clubId) {
      return (
        <>
          <p>reinitializing subscriptions...</p>
          <SubscriptionComponent
            clubId={clubId}
            authMode={
              authStatus === "authenticated"
                ? "AMAZON_COGNITO_USER_POOLS"
                : "API_KEY"
            }
          />
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
