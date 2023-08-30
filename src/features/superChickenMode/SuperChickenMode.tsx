import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import SignUpForm from "../signUp/SignUpForm";
import SubscriptionDisplayer from "./SubscriptionDisplayer";

export default function SuperChickenMode() {
  return (
    <>
      <ScoreBridgeAuthenticator />
      <SignUpForm />
      <SubscriptionDisplayer />
    </>
  );
}
