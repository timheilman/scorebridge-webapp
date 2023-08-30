import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setClubDevices } from "../clubDevices/clubDevicesSlice";
import { setFallbackClubId } from "../subscriptions/subscriptionsSlice";

export function FallbackForm() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();

  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFallbackClubId(event.target.value));
    if (event.target.value.length !== 26) {
      dispatch(setClubDevices({}));
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
        data-test-id="fallbackClubId"
      />
    </>
  );
}
