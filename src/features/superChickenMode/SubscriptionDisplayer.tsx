import SubscriptionResult from "./SubscriptionResult";

export default function SubscriptionDisplayer() {
  return (
    <ul>
      <SubscriptionResult subscriptionId="onCreateClubDevice" />
      <SubscriptionResult subscriptionId="onDeleteClubDevice" />
      <SubscriptionResult subscriptionId="onUpdateClub" />
    </ul>
  );
}
