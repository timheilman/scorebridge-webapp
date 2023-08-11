import { defineConfig } from "cypress";

import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import {
  fetchLatestEmail,
  fetchEmailsExpectingNone,
} from "./cypress/tasks/fetchLatestEmail";
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
      });
    },
  },
});
