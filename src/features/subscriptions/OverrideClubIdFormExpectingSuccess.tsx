import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { selectFallbackClubId, setFallbackClubId } from "./subscriptionsSlice";

export function OverrideClubIdFormExpectingSuccess() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();
  const fallbackClubId = useAppSelector(selectFallbackClubId);
  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFallbackClubId(event.target.value));
  };
  return (
    <>
      <label htmlFor="fallbackClubId">
        {t("subscriptions.fallbackClubId.label")}
      </label>
      <input
        type="text"
        id="fallbackClubId"
        placeholder={t("subscriptions.fallbackClubId.placeholder")}
        onChange={handleChangeFallbackClubId}
        value={fallbackClubId}
        data-test-id="inputFallbackClubId"
      />{" "}
    </>
  );
}
