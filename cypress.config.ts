import { defineConfig } from "cypress";
import { log } from "./cypress/tasks/log";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";

export default defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on("task", {
        ...log,
        ...createTempEmailAccount,
      });
    },
  },
});
