import { defineConfig } from "cypress";

import { cleanupClubDevice } from "./cypress/tasks/cleanupClubDevice";
import { cleanupUser } from "./cypress/tasks/cleanupUser";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import { expectClubDetails } from "./cypress/tasks/expectClubDetails";
import { expectDdbUserDetails } from "./cypress/tasks/expectDdbUserDetails";
import { fetchGroupsForUser } from "./cypress/tasks/fetchGroupsForUser";
import { fetchLatestEmail } from "./cypress/tasks/fetchLatestEmail";
import { fetchNullableCogUser } from "./cypress/tasks/fetchNullableCogUser";
import { fetchSecret } from "./cypress/tasks/fetchSecret";
import { log } from "./cypress/tasks/log";
import { purgeSqsQueue } from "./cypress/tasks/purgeSqsQueue";
import { receiveMessagesFromSqs } from "./cypress/tasks/receiveMessagesFromSqs";
import { setNewPasswordViaAdmin } from "./cypress/tasks/setNewPasswordViaAdmin";

export default defineConfig({
  chromeWebSecurity: false, // so we can get the iFrame inside recaptcha2
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: "http://localhost:3000/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on("task", {
        log,
        createTempEmailAccount,
        fetchLatestEmail,
        setNewPasswordViaAdmin,
        fetchNullableCogUser,
        fetchGroupsForUser,
        fetchSecret,
        expectClubDetails,
        expectDdbUserDetails,
        cleanupUser,
        cleanupClubDevice,
        receiveMessagesFromSqs,
        purgeSqsQueue,
      });
    },
  },
});
