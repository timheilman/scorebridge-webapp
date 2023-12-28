import { useAppSelector } from "../app/hooks";
import { selectClubId } from "../features/header/idTokenSlice";
import { selectFallbackClubId } from "../features/subscriptions/subscriptionsSlice";

export const useClubId = () => {
  const clubId = useAppSelector(selectClubId);
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  if (fallbackClubId && fallbackClubId.length === 26) {
    return fallbackClubId;
  }
  if (!clubId) {
    return;
  }
  return clubId;
};
