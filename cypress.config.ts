import { defineConfig } from "cypress";

import { cleanupUser } from "./cypress/tasks/cleanupUser";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import { expectClubName } from "./cypress/tasks/expectClubName";
import { fetchGroupsForUser } from "./cypress/tasks/fetchGroupsForUser";
import { fetchLatestEmail } from "./cypress/tasks/fetchLatestEmail";
import { fetchNullableUser } from "./cypress/tasks/fetchNullableUser";
import { log } from "./cypress/tasks/log";
import { setNewPasswordViaAdmin } from "./cypress/tasks/setNewPasswordViaAdmin";
import { receiveMessageFromSqs } from "./cypress/tasks/receiveMessageFromSqs";

export default defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on("task", {
        ...log,
        ...createTempEmailAccount,
        ...fetchLatestEmail,
        ...setNewPasswordViaAdmin,
        ...fetchNullableUser,
        ...fetchGroupsForUser,
        ...expectClubName,
        ...cleanupUser,
        ...receiveMessageFromSqs,
      });
    },
  },
});
