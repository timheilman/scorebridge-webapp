import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { CreateClubResponse } from "../../../appsync";
import { gqlMutation } from "../../gql";
import { mutationDeleteClubAndAdmin } from "../../graphql/mutations";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import styles from "./SignUpForm.module.css";
const log = logFn("src.features.signUp.ForgetMeForm");

const deleteClubAndAdmin = async (
  clubId: string,
  userId: string,
  authStatus: AuthStatus,
) => {
  /* create a new club */
  return gqlMutation<CreateClubResponse>(
    authStatus,
    mutationDeleteClubAndAdmin,
    {
      input: { clubId, userId },
    },
  );
};

interface MaybeErrorElementParams {
  submitInFlight: boolean;
  everSubmitted: boolean;
  deleteClubAndAdminError: string | null;
  t: TypesafeTranslationT;
}
function maybeFooterElement({
  deleteClubAndAdminError,
  submitInFlight,
  everSubmitted,
  t,
}: MaybeErrorElementParams) {
  if (submitInFlight) {
    return <div>{t("forgetMe.deletingAccount")}</div>;
  }
  if (deleteClubAndAdminError) {
    return (
      <div>
        {t("problemWithLastSubmission")} <pre>{deleteClubAndAdminError}</pre>
      </div>
    );
  }
  if (everSubmitted) {
    return <div>{t("forgetMe.accountDeleted")}</div>;
  }
}

export default function ForgetMeForm() {
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [deleteClubAndAdminError, setDeleteClubAndAdminError] = useState<
    string | null
  >(null);
  const [confirm, setConfirm] = useState("");
  const { authStatus, user, signOut } = useAuthenticator((context) => [
    context.authStatus,
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

  /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */
  function handleExpectedGqlReject(errors: Array<any>) {
    setDeleteClubAndAdminError(
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
      handleExpectedGqlReject(reason.errors as Array<unknown>);
    } else if (reason.message) {
      setDeleteClubAndAdminError(reason.message as string);
    } else {
      log("handleGqlReject.error", "error", reason);
      setDeleteClubAndAdminError(JSON.stringify(reason, null, 2));
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */

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

    deleteClubAndAdmin(
      clubId as string /* adminSuper: don't do this */,
      user.username,
      authStatus,
    )
      .then((result) => {
        setDeleteClubAndAdminError(null);
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
          setDeleteClubAndAdminError(t("signUp.userAlreadyExists"));
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
      {maybeFooterElement({
        everSubmitted,
        submitInFlight,
        deleteClubAndAdminError,
        t,
      })}
    </div>
  );
}
