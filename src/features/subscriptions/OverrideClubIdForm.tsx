import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import { setFallbackClubId } from "./subscriptionsSlice";

export function OverrideClubIdForm() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();
  const [volatileFallbackClubId, setVolatileFallbackClubId] =
    useState<string>("");
  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    setVolatileFallbackClubId(event.target.value);
  };
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    if (volatileFallbackClubId) {
      dispatch(setFallbackClubId(volatileFallbackClubId));
    }
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
        value={volatileFallbackClubId}
        data-test-id="inputFallbackClubId"
      />{" "}
      <button onClick={handleSubmit} data-test-id="buttonSubmitFallbackClubId">
        set club id
      </button>
    </>
  );
}
