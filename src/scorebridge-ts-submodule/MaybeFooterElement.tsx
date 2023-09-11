import { JSX } from "react";

export interface MaybeFooterElementParams {
  submitInFlight: boolean;
  everSubmitted: boolean;
  errStr: string | null;
  submitInFlightElt: JSX.Element;
  errElt: JSX.Element;
  successElt: JSX.Element;
}
export const MaybeFooterElement = ({
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
  return null;
};
