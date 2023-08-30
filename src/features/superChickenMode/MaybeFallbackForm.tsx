import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setFallbackClubId } from "../subscriptions/subscriptionsSlice";

export default function MaybeFallbackForm() {
  const dispatch = useAppDispatch();
  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFallbackClubId(event.target.value));
  };
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const t = useTranslation().t as TypesafeTranslationT;
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit!</p>
        <label htmlFor="fallbackClubId">
          {t("tabs.subscriptions.fallbackClubId")}
        </label>
        <input
          type="text"
          id="fallbackClubId"
          placeholder={t("tabs.subscriptions.fallbackClubId.placeholder")}
          onChange={handleChangeFallbackClubId}
          data-test-id="fallbackClubId"
        />
      </>
    );
  }
  return null;
}
