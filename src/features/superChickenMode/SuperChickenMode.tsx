import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../../app/hooks";
import { useClubId } from "../../lib/useClubId";
import { selectLanguageResolved } from "../languageSelector/selectedLanguageSlice";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import { SubscriptionsComponent } from "../subscriptions/SubscriptionsComponent";
import FallbackFormWhenNonAdminSuper from "./FallbackFormWhenNonAdminSuper";
import SubscriptionDisplayer from "./SubscriptionDisplayer";

export default function SuperChickenMode() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const clubId = useClubId();
  const languageResolved = useAppSelector(selectLanguageResolved);
  const MaybeSubscriptions = () => {
    if (authStatus !== "authenticated" && clubId && languageResolved) {
      return (
        <>
          <p>initializing subscriptions for api key...</p>
          <SubscriptionsComponent clubId={clubId} authMode="apiKey" />
        </>
      );
    } else if (authStatus !== "authenticated") {
      return (
        <p>subscriptions handled by sessionful header when authenticated</p>
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
