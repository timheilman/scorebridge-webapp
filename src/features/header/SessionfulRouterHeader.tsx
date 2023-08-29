import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, useLocation } from "react-router-dom";

import { ClubDevice, ListClubDevicesOutput } from "../../../appsync";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { queryListClubDevices } from "../../graphql/mutations";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import requiredEnvVar from "../../requiredEnvVar";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { setClubDevices } from "../clubDevices/clubDevicesSlice";
import LanguageSelector from "../languageSelector/LanguageSelector";
import SignOutButton from "../signIn/SignOutButton";
import { selectSuperChickenMode } from "../superChickenMode/superChickenModeSlice";
const log = logFn("src.features.header.SessionfulRouterHeader");
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (clubId: string, dispatch: any) => {
  // Retrieve some/all data from AppSync
  return gqlMutation<ListClubDevicesOutput>(
    "authenticated",
    queryListClubDevices,
    {
      input: { clubId },
    },
  ).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const d = res.data.listClubDevices.clubDevices as ClubDevice[];
    // TODO: handle nextToken etc...
    log("dispatchingSetClubDevices", "debug", { res });
    dispatch(setClubDevices(d));
  });
};

export default function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { pathname } = useLocation();
  const { user } = useAuthenticator((context) => [context.user]);
  const superChickenMode = useAppSelector(selectSuperChickenMode);
  const dispatch = useAppDispatch();
  let priorConnectionState: string;
  const clubId = useClubId();
  useEffect(() => {
    log("initialFetch", "debug");
    fetchRecentData(clubId, dispatch).catch((e) =>
      log("badInitialGqlQuery", "error", { e }),
    );
    Hub.listen("api", (data: any) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          log("refreshFetch", "debug");
          fetchRecentData(
            (user.attributes && user.attributes["custom:tenantId"]) as string,
            dispatch,
          ).catch((e) => log("badRefreshGqlQuery", "error", { e }));
        }
        priorConnectionState = payload.data.connectionState;
      }
    });
  }, []);
  if (["/signin", "/signup"].includes(pathname)) {
    // naturally move to this page when logging in, and so the above tabs disappear:
    return <Navigate to="/club_devices" />;
  }
  function superChickenNavLink() {
    if (!superChickenMode) {
      return;
    }
    return (
      <NavLink
        to="super_chicken_mode"
        className="button rounded"
        data-test-id="superChickenModeTab"
      >
        {t("tabs.superChickenMode")}
      </NavLink>
    );
  }
  return (
    <header className="sticky">
      <NavLink to="/club_devices" className="button rounded">
        {t("tabs.clubDevices")}
      </NavLink>
      <NavLink to="/players" className="button rounded">
        {t("tabs.players")}
      </NavLink>
      <NavLink to="/rotation" className="button rounded">
        {t("tabs.rotation")}
      </NavLink>
      <NavLink
        to="/forget_me"
        className="button rounded"
        data-test-id="forgetMeTab"
      >
        {t("tabs.forgetMe")}
      </NavLink>
      {superChickenNavLink()}
      {requiredEnvVar("STAGE") === "prod" ? "" : <LanguageSelector />}
      <SignOutButton />
    </header>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
