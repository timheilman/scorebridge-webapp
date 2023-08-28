import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

import { CreateClubResponse } from "../../../appsync";
import { gqlMutation } from "../../gql";
import { mutationCreateClub } from "../../graphql/mutations";
import { logFn } from "../../lib/logging";
import requiredEnvVar from "../../requiredEnvVar";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import styles from "./SignUpForm.module.css";
const log = logFn("src.features.signUp.SignUpForm");

const createClub = async (
  newAdminEmail: string,
  newClubName: string,
  authStatus: AuthStatus,
  recaptchaToken?: string,
) => {
  /* create a new club */
  return gqlMutation<CreateClubResponse>(authStatus, mutationCreateClub, {
    input: {
      newAdminEmail,
      newClubName,
      suppressInvitationEmail: false,
      recaptchaToken,
    },
  });
};

interface MaybeErrorElementParams {
  submitInFlight: boolean;
  everSubmitted: boolean;
  createClubError: string | null;
}
function maybeFooterElement({
  createClubError,
  submitInFlight,
  everSubmitted,
}: MaybeErrorElementParams) {
  if (submitInFlight) {
    return <div>sending email...</div>;
  }
  if (createClubError) {
    return (
      <div>
        Problem with last submission: <pre>{createClubError}</pre>
      </div>
    );
  }
  if (everSubmitted) {
    return <div>email sent!</div>;
  }
}

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [createClubError, setCreateClubError] = useState<string | null>(null);
  const [recaptchaPassed, setRecaptchaPassed] = useState(false);

  const captchaRef = useRef<{
    getValue: () => string;
    reset: () => void;
  } | null>(null);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const t = useTranslation().t as TypesafeTranslationT;
  /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */
  function handleExpectedGqlReject(errors: Array<any>) {
    setCreateClubError(
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
      setCreateClubError(reason.message as string);
    } else {
      log(
        "handleGqlReject.unexpectedError",
        "error",
        `unexpected form of gql promise rejection`,
        reason,
      );
      setCreateClubError(JSON.stringify(reason, null, 2));
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setEverSubmitted(true);
    setSubmitInFlight(true);
    log("handleSubmit.start", "debug");
    createClub(email, clubName, authStatus, captchaRef.current?.getValue())
      .then((result) => {
        captchaRef.current?.reset();
        setCreateClubError(null);
        setSubmitInFlight(false);
        setRecaptchaPassed(false);
        log("handleSubmit.createClub.success", "debug", { result });
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((reason: any) => {
        captchaRef.current?.reset();
        setRecaptchaPassed(false);
        log("handleSubmit.createClub.error", "error", reason);
        if (
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          reason.errors &&
          Array.isArray(reason.errors) &&
          reason.errors.length > 0 &&
          reason.errors[0] &&
          reason.errors[0].errorType === "UserAlreadyExistsError"
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        ) {
          setCreateClubError(t("signUp.userAlreadyExists"));
        } else {
          handleGqlReject(reason);
        }
        setSubmitInFlight(false);
      });
    log("handleSubmit.createClub.start", "debug");
  };
  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setClubName(event.target.value);
  };

  const handleRecaptchaChange = (value: string) => {
    log("handleRecaptchaChange", "debug", {
      value,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      captchaRefCurrent: captchaRef.current?.getValue(),
    });
    setRecaptchaPassed(!!captchaRef.current?.getValue());
  };
  return (
    <div>
      <form className="input-group vertical" onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("signUp.legend")}</legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label htmlFor="email">{t("signUp.email.label")}</label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="email"
                placeholder={t("signUp.email.placeholder")}
                onChange={handleChangeEmail}
                data-test-id="formCreateClubEmailAddress"
              />
            </div>
            <div className="col-sm-12 col-md-6">
              <label htmlFor="clubName">{t("signUp.clubName.label")}</label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="clubName"
                placeholder={t("signUp.clubName.placeholder")}
                onChange={handleChangeName}
                data-test-id="formCreateClubClubName"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-wm">
              <ReCAPTCHA
                sitekey={requiredEnvVar("RECAPTCHA2_SITE_KEY")}
                onChange={handleRecaptchaChange}
                ref={captchaRef}
                data-test-id="recaptchaComponent"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              {/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */}
              <button
                disabled={
                  submitInFlight || !recaptchaPassed || !email || !clubName
                }
                className="primary"
                data-test-id="formCreateClubSubmit"
              >
                {/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */}
                {t("signUp.submit")}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      {maybeFooterElement({ everSubmitted, submitInFlight, createClubError })}
    </div>
  );
}
