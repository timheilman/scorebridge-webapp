import SubscriptionTest from "./SubscriptionTest";

export default function SubscriptionDisplayer() {
  return (
    <ul>
      <SubscriptionTest subscriptionId="createdClubDevice" />
      <SubscriptionTest subscriptionId="deletedClubDevice" />
    </ul>
  );
}
