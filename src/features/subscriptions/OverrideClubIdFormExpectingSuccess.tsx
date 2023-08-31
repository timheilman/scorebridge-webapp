import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setFallbackClubId } from "./subscriptionsSlice";

export function OverrideClubIdFormExpectingSuccess() {
  const t = useTranslation().t as TypesafeTranslationT;
  const dispatch = useAppDispatch();
  // const fallbackClubId = useAppSelector(selectFallbackClubId);
  const handleChangeFallbackClubId = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFallbackClubId(event.target.value));
  };
  // const submitButtonDisabled = () => {
  //   return !fallbackClubId;
  // };
  // const handleSubmit = (event: SyntheticEvent) => {
  //   event.preventDefault(); // we are taking over, in react, from browser event handling here
  //   dispatch(setClubDevices({}));
  //   dispatch(setFallbackClubId(fallbackClubId));
  // };
  return (
    <>
      {/*<form className="input-group vertical" onSubmit={handleSubmit}>*/}
      {/*  <fieldset>*/}
      {/*    <div className="row">*/}
      {/*      <div className="col-sm-12 col-md-6">*/}
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
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="row">*/}
      {/*      <div className="col-sm">*/}
      {/*        <button*/}
      {/*          disabled={submitButtonDisabled()}*/}
      {/*          className="primary"*/}
      {/*          data-test-id="formFallbackClubId"*/}
      {/*        >*/}
      {/*          {t("subscriptions.fallbackClubId.submit")}*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </fieldset>*/}
      {/*</form>*/}
    </>
  );
}
