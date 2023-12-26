import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import { Club } from "../../scorebridge-ts-submodule/graphql/appsync";
import { mutationUpdateClub } from "../../scorebridge-ts-submodule/graphql/mutations";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import styles from "../signUp/SignUpForm.module.css";
import { selectClubName } from "./clubDevicesSlice";
const log = logFn("src.features.clubDevices.clubName.");

export function ClubName() {
  const t = useTranslation().t as TypesafeTranslationT;
  const clubName = useAppSelector(selectClubName);
  const clubId = useClubId();
  const [volatileClubName, setVolatileClubName] = useState("");
  useEffect(
    () => setVolatileClubName(clubName ?? "loading club name..."),
    [clubName],
  );

  const updateClub = async (
    club: Omit<Omit<Club, "createdAt">, "updatedAt">,
  ) => {
    return gqlMutation<{ updateClub: Club }>(mutationUpdateClub, {
      input: {
        id: club.id,
        name: club.name,
      },
    });
  };
  const handleChangeClubName = (event: ChangeEvent<HTMLInputElement>) => {
    setVolatileClubName(event.target.value);
  };

  const handleSubmitClubName = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    if (!clubId) {
      throw new Error("No clubId for handleSubmitClubName");
    }
    const args = { id: clubId, name: volatileClubName };
    log("handleChangeClubName.updateClub", "debug", args);
    updateClub(args).catch((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      log("handleChangeClubName.error", "error", { e });
    });
  };

  return (
    <div>
      <p>Your club name: {clubName}</p>
      <form className="input-group horizontal" onSubmit={handleSubmitClubName}>
        <fieldset>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label htmlFor="clubNameInput">
                {t("clubDevices.clubName.label")}
              </label>
              <input
                className={styles.myInputWidth}
                type="text"
                id="clubNameInput"
                onChange={handleChangeClubName}
                value={volatileClubName}
                data-test-id="clubDevicesPageClubName"
              />
            </div>
            <div className="col-sm">
              <button
                disabled={volatileClubName.length === 0}
                className="primary"
                data-test-id="clubDevicesPageClubNameSubmit"
              >
                {t("clubDevices.clubName.submit")}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
