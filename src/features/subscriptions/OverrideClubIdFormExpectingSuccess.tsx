import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setFallbackClubId } from "./subscriptionsSlice";

export function OverrideClubIdFormExpectingSuccess() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();
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
        data-test-id="inputFallbackClubId"
      />{" "}
    </>
  );
}
