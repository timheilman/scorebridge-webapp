import { GraphQLQuery, GraphQLResult } from "@aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { ClubDevice } from "../../../appsync";
import { gqlMutation } from "../../gql";
import { handleGqlReject, maybeFooterElement } from "../../lib/gql";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import { mutationCreateClubDevice } from "../../scorebridge-ts-submodule/graphql/mutations";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
const log = logFn("src.features.clubDevices.createClubDeviceForm.");
export function CreateClubDeviceForm() {
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [errStr, setErrStr] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [createdDeviceName, setCreatedDeviceName] = useState("");
  const [regToken, setRegToken] = useState("");
  const clubId = useClubId();
  const { authStatus } = useAuthenticator();
  const createClubDevice = async (deviceName: string, regToken: string) => {
    /* create a new club */
    return gqlMutation<{ createClubDevice: ClubDevice }>(
      authStatus,
      mutationCreateClubDevice,
      {
        input: {
          clubId,
          deviceName,
          regToken,
        },
      },
    );
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    setSubmitInFlight(true);
    setEverSubmitted(true);
    setSubmitInFlight(true);
    log("handleSubmit.start", "debug");
    createClubDevice(deviceName, regToken)
      .then(
        (c: GraphQLResult<GraphQLQuery<{ createClubDevice: ClubDevice }>>) => {
          setSubmitInFlight(false);
          setErrStr(null);
          if (!c.data) {
            throw new Error("gotta have data");
          }
          setDeviceId(c.data.createClubDevice.clubDeviceId);
          setCreatedDeviceName(c.data.createClubDevice.name);
        },
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((reason: any) => {
        setSubmitInFlight(false);
        handleGqlReject(reason, setErrStr);
      });
  };
  const handleChangeNewDeviceName = (event: ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };

  const handleChangeRegToken = (event: ChangeEvent<HTMLInputElement>) => {
    setRegToken(event.target.value);
  };

  const t = useTranslation().t as TypesafeTranslationT;
  return (
    <>
      <form className="input-group vertical" onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("clubDevices.createClubDeviceForm.legend")}</legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label htmlFor="deviceName">
                {t("clubDevices.createClubDeviceForm.deviceName.label")}
              </label>
              <input
                style={{ width: "85%" }}
                type="text"
                id="deviceName"
                placeholder={t(
                  "clubDevices.createClubDeviceForm.deviceName.placeholder",
                )}
                onChange={handleChangeNewDeviceName}
                value={deviceName}
                data-test-id="formCreateClubDeviceDeviceName"
              />
            </div>
            <div className="col-sm-12 col-md-6">
              <label htmlFor="regToken">
                {t("clubDevices.createClubDeviceForm.regToken.label")}
              </label>
              <input
                style={{ width: "85%" }}
                type="text"
                id="regToken"
                placeholder={t(
                  "clubDevices.createClubDeviceForm.regToken.placeholder",
                )}
                onChange={handleChangeRegToken}
                value={regToken}
                data-test-id="formCreateClubDeviceRegToken"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              {}
              <button
                disabled={submitInFlight || !deviceName || !regToken}
                className="primary"
                data-test-id="formCreateClubDeviceSubmit"
              >
                {/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */}
                {t("clubDevices.createClubDeviceForm.submit")}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      {maybeFooterElement({
        errStr,
        submitInFlight,
        everSubmitted,
        submitInFlightElt: <div>creating device in cloud...</div>,
        errElt: <div>Problem: {errStr}</div>,
        successElt: (
          <div>
            device {createdDeviceName}: {deviceId} created
          </div>
        ),
      })}
    </>
  );
}
