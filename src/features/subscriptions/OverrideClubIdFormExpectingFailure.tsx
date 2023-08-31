import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setFailingClubId } from "./subscriptionsSlice";

export function OverrideClubIdFormExpectingFailure() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();
  const handleChangeFailingClubId = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFailingClubId(event.target.value));
  };
  return (
    <>
      <label htmlFor="failingClubId">
        {t("subscriptions.failingClubId.label")}
      </label>
      <input
        type="text"
        id="failingClubId"
        placeholder={t("subscriptions.failingClubId.placeholder")}
        onChange={handleChangeFailingClubId}
        data-test-id="inputFailingClubId"
      />
    </>
  );
}
