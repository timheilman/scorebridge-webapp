import { useAuthenticator } from "@aws-amplify/ui-react";

import { useAppSelector } from "../app/hooks";
import { selectFallbackClubId } from "../features/subscriptions/subscriptionsSlice";

export const useClubId = () => {
  const { user } = useAuthenticator();
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  if (fallbackClubId && fallbackClubId.length === 26) {
    return fallbackClubId;
  }
  if (user && user.attributes && user.attributes["custom:tenantId"]) {
    return user.attributes["custom:tenantId"];
  }
};
