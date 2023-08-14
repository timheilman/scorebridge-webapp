import { defineConfig } from "cypress";

import { cleanupUser } from "./cypress/tasks/cleanupUser";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import { expectClubName } from "./cypress/tasks/expectClubName";
import { expectUserDetails } from "./cypress/tasks/expectUserDetails";
import { fetchGroupsForUser } from "./cypress/tasks/fetchGroupsForUser";
import { fetchLatestEmail } from "./cypress/tasks/fetchLatestEmail";
import { fetchNullableUser } from "./cypress/tasks/fetchNullableUser";
import { log } from "./cypress/tasks/log";
import { purgeSqsQueue } from "./cypress/tasks/purgeSqsQueue";
import { receiveMessagesFromSqs } from "./cypress/tasks/receiveMessagesFromSqs";
import { setNewPasswordViaAdmin } from "./cypress/tasks/setNewPasswordViaAdmin";

export default defineConfig({
  defaultCommandTimeout: 10000,
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
        ...expectUserDetails,
        ...cleanupUser,
        ...receiveMessagesFromSqs,
        ...purgeSqsQueue,
      });
    },
  },
});
