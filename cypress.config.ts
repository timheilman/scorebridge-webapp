import { defineConfig } from "cypress";
import { createTestAccount } from "nodemailer";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(message);

          return null;
        },
        async createTempEmailAcct() {
          console.log("Creating email account...");
          const testAccount = await createTestAccount();
          // use testAccount.user and testAccount.pass
          // to log in into the email inbox
          return {
            email: testAccount.user,

            /**
             * Utility method for getting the last email
             * for the Ethereal email account created above.
             */
            async getLastEmail() {
              // connect to the IMAP inbox for the test account
              // and get the last email
            },
          };
        },
      });
    },
  },
});
