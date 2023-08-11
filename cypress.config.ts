import { defineConfig } from "cypress";

import { cleanupUser } from "./cypress/tasks/cleanupUser";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import { expectClubName } from "./cypress/tasks/expectClubName";
import { fetchGroupsForUser } from "./cypress/tasks/fetchGroupsForUser";
import {
  fetchEmailsExpectingNone,
  fetchLatestEmail,
} from "./cypress/tasks/fetchLatestEmail";
import { fetchNullableUser } from "./cypress/tasks/fetchNullableUser";
import { log } from "./cypress/tasks/log";
import { setNewPasswordViaAdmin } from "./cypress/tasks/setNewPasswordViaAdmin";

export default defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on("task", {
        ...log,
        ...createTempEmailAccount,
        ...fetchLatestEmail,
        ...setNewPasswordViaAdmin,
        ...fetchEmailsExpectingNone,
        ...fetchNullableUser,
        ...fetchGroupsForUser,
        ...expectClubName,
        ...cleanupUser,
      });
    },
  },
});
