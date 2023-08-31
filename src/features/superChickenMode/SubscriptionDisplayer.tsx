import SubscriptionResult from "./SubscriptionResult";

export default function SubscriptionDisplayer() {
  return (
    <ul>
      <SubscriptionResult subscriptionId="createdClubDevice" />
      <SubscriptionResult subscriptionId="deletedClubDevice" />
    </ul>
  );
}
