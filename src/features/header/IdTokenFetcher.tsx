import { fetchAuthSession, JWT } from "aws-amplify/auth";
import { useEffect } from "react";
import { Trans } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import { setClubId, setCognitoGroups } from "./idTokenSlice";
const log = logFn("src.features.header.idTokenFetcher");
export function IdTokenFetcher() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    log("idTokenFetchStart", "debug");
    const fetchIdToken = async () => {
      const { tokens } = await fetchAuthSession();
      const idToken: JWT | undefined = tokens?.idToken;
      if (!idToken) {
        throw new Error(
          "Unable to find idToken from amplify v6 fetchAuthSession",
        );
      }
      dispatch(setCognitoGroups(idToken.payload["cognito:groups"] as string[]));
      dispatch(setClubId(idToken.payload["custom:tenantId"] as string));
      log("idTokenFetchSuccess", "debug", { idToken });
    };
    fetchIdToken().catch((err: unknown) => {
      log("idTokenFetchFailed", "error", { err });
    });
  }, [dispatch]);
  return <Trans>Awaiting cognito session fetch...</Trans>;
}
