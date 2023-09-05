import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../scorebridge-ts-submodule/useClubId";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import FallbackFormWhenNonAdminSuper from "../subscriptions/FallbackFormWhenNonAdminSuper";
import Subscriptions from "../subscriptions/Subscriptions";
import { selectFallbackClubId } from "../subscriptions/subscriptionsSlice";
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
          <Subscriptions clubId={clubId} />
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
