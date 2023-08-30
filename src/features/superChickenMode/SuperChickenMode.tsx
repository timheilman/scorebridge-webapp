import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../../app/hooks";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import Subscriptions from "../subscriptions/Subscriptions";
import { selectFallbackClubId } from "../subscriptions/subscriptionsSlice";
import MaybeFallbackForm from "./MaybeFallbackForm";
import SubscriptionDisplayer from "./SubscriptionDisplayer";

export default function SuperChickenMode() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  const MaybeSubscriptions = () => {
    if (authStatus !== "authenticated" && fallbackClubId.length === 26) {
      return (
        <>
          <p>reinitializing subscriptions...</p>
          <Subscriptions clubId={fallbackClubId} />
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
      <MaybeFallbackForm />
      <MaybeSubscriptions />
      <SubscriptionDisplayer />
    </>
  );
}
