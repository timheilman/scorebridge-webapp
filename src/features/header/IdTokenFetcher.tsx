import { fetchAuthSession, JWT } from "aws-amplify/auth";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import {
  selectCognitoGroups,
  setClubId,
  setCognitoGroups,
} from "./idTokenSlice";
import SessionfulRouterHeader from "./SessionfulRouterHeader";
const log = logFn("src.features.header.idTokenFetcher");
export function IdTokenFetcher() {
  const dispatch = useAppDispatch();
  const cognitoGroups = useAppSelector(selectCognitoGroups);
  useEffect(() => {
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
    };
    fetchIdToken().catch((err: unknown) => {
      log("idTokenFetchFailed", "error", { err });
    });
  }, [dispatch]);
  if (!cognitoGroups) {
    return null;
  }
  return <SessionfulRouterHeader />;
}
