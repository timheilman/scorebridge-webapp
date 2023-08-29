import { JSX, useState } from "react";

import { logFn } from "./logging";

const log = logFn("src.lib.gql.");
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */
const handleExpectedGqlReject = (
  errors: Array<any>,
  errStrSetter: (errStr: string) => void,
) => {
  errStrSetter(
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
};

export const handleGqlReject = (
  reason: any,
  errStrSetter: (errStr: string) => void,
) => {
  if (reason.errors && Array.isArray(reason.errors)) {
    handleExpectedGqlReject(reason.errors as Array<unknown>, errStrSetter);
  } else if (reason.message) {
    errStrSetter(reason.message as string);
  } else {
    log("handleGqlReject.unexpectedError", "error", reason);
    errStrSetter(JSON.stringify(reason, null, 2));
  }
};
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions */

export interface MaybeFooterElementParams {
  submitInFlight: boolean;
  everSubmitted: boolean;
  errStr: string | null;
  submitInFlightElt: JSX.Element;
  errElt: JSX.Element;
  successElt: JSX.Element;
}
export const maybeFooterElement = ({
  errStr,
  submitInFlight,
  everSubmitted,
  submitInFlightElt,
  errElt,
  successElt,
}: MaybeFooterElementParams) => {
  if (submitInFlight) {
    return submitInFlightElt;
  }
  if (errStr) {
    return errElt;
  }
  if (everSubmitted) {
    return successElt;
  }
};

export const useStatefulForm = () => {
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [errStr, setErrStr] = useState<string | null>(null);
  return {
    submitInFlight,
    everSubmitted,
    errStr,
    setSubmitInFlight,
    setEverSubmitted,
    setErrStr,
  };
};
