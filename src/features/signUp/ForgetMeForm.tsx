import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import { CreateClubResponse } from "../../scorebridge-ts-submodule/graphql/appsync";
import { mutationDeleteClubAndAdmin } from "../../scorebridge-ts-submodule/graphql/mutations";
import { MaybeFooterElement } from "../../scorebridge-ts-submodule/MaybeFooterElement";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import styles from "./SignUpForm.module.css";
const log = logFn("src.features.signUp.ForgetMeForm");

const deleteClubAndAdmin = async (clubId: string, userId: string) => {
  /* create a new club */
  return gqlMutation<CreateClubResponse>(mutationDeleteClubAndAdmin, {
    input: { clubId, userId },
  });
};

export default function ForgetMeForm() {
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [errStr, setErrStr] = useState("");
  const [confirm, setConfirm] = useState("");
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut,
  ]);
  const clubId = useClubId();
  const t = useTranslation().t as TypesafeTranslationT;
  const confirmPhrase = t("forgetMe.confirm.phrase");
  const submitButtonDisabled = () => {
    return submitInFlight || confirm != confirmPhrase;
  };
  const handleChangeConfirm = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirm(event.target.value);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access */
  function handleExpectedGqlReject(errors: any[]) {
    setErrStr(
      errors
        .map((error) => {
          if (error.message) {
            if (error.errorType) {
              return `ErrorType: ${error.errorType}; Message: ${error.message}`;
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return error.message;
            }
          } else {
            return JSON.stringify(error);
          }
        })
        .join("\n"),
    );
  }

  function handleGqlReject(reason: any) {
    if (reason.errors && Array.isArray(reason.errors)) {
      handleExpectedGqlReject(reason.errors as unknown[]);
    } else if (reason.message) {
      setErrStr(reason.message as string);
    } else {
      log("handleGqlReject.error", "error", reason);
      setErrStr(JSON.stringify(reason, null, 2));
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access */

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setEverSubmitted(true);
    setSubmitInFlight(true);
    log("handleSubmit.start", "debug");
    if (!user.username) {
      throw new Error("no username in ForgetMeForm");
    }
    if (!user.attributes) {
      throw new Error("no attributes in ForgetMeForm");
    }

    deleteClubAndAdmin(clubId /* adminSuper: don't do this */, user.username)
      .then((result) => {
        setErrStr("");
        setSubmitInFlight(false);
        log("deleteClubAndAdmin.success", "debug", { result });
        signOut();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((reason: any) => {
        log("deleteClubAndAdmin.error", "error", reason);
        if (
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          reason.errors &&
          Array.isArray(reason.errors) &&
          reason.errors.length > 0 &&
          reason.errors[0] &&
          reason.errors[0].errorType === "UserAlreadyExistsError"
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        ) {
          setErrStr(t("signUp.userAlreadyExists"));
        } else {
          handleGqlReject(reason);
        }
        setSubmitInFlight(false);
      });
    log("deleteClubAndAdmin.start", "debug");
  };

  return (
    <div>
      <p>{t("forgetMe.text")}</p>
      <form className="input-group vertical" onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("forgetMe.legend")}</legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label htmlFor="confirm">
                {t("forgetMe.confirm.labelBefore")}
                {t("forgetMe.confirm.phrase")}
                {t("forgetMe.confirm.labelAfter")}
              </label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="confirm"
                placeholder={t("forgetMe.confirm.placeholder")}
                value={confirm}
                onChange={handleChangeConfirm}
                data-test-id="formForgetMeConfirm"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              <button
                disabled={submitButtonDisabled()}
                className="primary"
                data-test-id="formForgetMeSubmit"
              >
                {t("forgetMe.submit")}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      <MaybeFooterElement
        everSubmitted={everSubmitted}
        submitInFlight={submitInFlight}
        errStr={errStr}
        successElt={<div>{t("forgetMe.accountDeleted")}</div>}
        errElt={<div>{t("problemWithLastSubmission")}</div>}
        submitInFlightElt={<div>{t("forgetMe.deletingAccount")}</div>}
      />
    </div>
  );
}
