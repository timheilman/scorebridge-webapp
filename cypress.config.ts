import { defineConfig } from "cypress";

import { cleanupUser } from "./cypress/tasks/cleanupUser";
import { createTempEmailAccount } from "./cypress/tasks/createTempEmailAccount";
import { expectClubDetails } from "./cypress/tasks/expectClubDetails";
import { expectDdbUserDetails } from "./cypress/tasks/expectDdbUserDetails";
import { fetchGroupsForUser } from "./cypress/tasks/fetchGroupsForUser";
import { fetchLatestEmail } from "./cypress/tasks/fetchLatestEmail";
import { fetchNullableCogUser } from "./cypress/tasks/fetchNullableCogUser";
import { log } from "./cypress/tasks/log";
import { purgeSqsQueue } from "./cypress/tasks/purgeSqsQueue";
import { receiveMessagesFromSqs } from "./cypress/tasks/receiveMessagesFromSqs";
import { setNewPasswordViaAdmin } from "./cypress/tasks/setNewPasswordViaAdmin";
import { loginByCognitoApi } from "./cypress/tasks/loginByCognitoApi";

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: "http://localhost:3000/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on("task", {
        ...log,
        ...createTempEmailAccount,
        ...fetchLatestEmail,
        ...setNewPasswordViaAdmin,
        ...fetchNullableCogUser,
        ...fetchGroupsForUser,
        ...expectClubDetails,
        ...expectDdbUserDetails,
        ...cleanupUser,
        ...receiveMessagesFromSqs,
        ...purgeSqsQueue,
        ...loginByCognitoApi,
      });
    },
  },
});
