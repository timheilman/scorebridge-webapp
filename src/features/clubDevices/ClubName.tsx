import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { Club } from "../../../appsync";
import { useAppSelector } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import { mutationUpdateClub } from "../../scorebridge-ts-submodule/graphql/mutations";
import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";
import { selectClubName } from "./clubDevicesSlice";
const log = logFn("src.features.clubDevices.clubName.");

export function ClubName() {
  const t = useTranslation().t as TypesafeTranslationT;
  const clubName = useAppSelector(selectClubName);
  const clubId = useClubId();
  const [volatileClubName, setVolatileClubName] = useState(clubName);
  const { authStatus } = useAuthenticator();
  const updateClub = async (
    club: Omit<Omit<Club, "createdAt">, "updatedAt">,
  ) => {
    return gqlMutation<{ updateClub: Club }>(authStatus, mutationUpdateClub, {
      input: {
        id: club.id,
        name: club.name,
      },
    });
  };
  const handleChangeClubName = (event: ChangeEvent<HTMLInputElement>) => {
    setVolatileClubName(event.target.value);
    if (!clubId) {
      throw new Error("No clubId for handleChangeClubName");
    }
    const args = { id: clubId, name: event.target.value };
    log("handleChangeClubName.updateClub", "debug", args);
    updateClub(args).catch((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      log("handleChangeClubName.error", "error", { e });
    });
  };

  return (
    <div>
      <p>Your club name: {clubName}</p>
      <label htmlFor="clubNameInput">
        {t("clubDevicesPage.clubName.label")}
      </label>
      <input
        style={{ width: "85%" }}
        type="text"
        id="clubNameInput"
        onChange={handleChangeClubName}
        value={volatileClubName}
        data-test-id="clubDevicesPageClubName"
      />
    </div>
  );
}
