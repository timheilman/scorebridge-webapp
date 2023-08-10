import { createTestAccount } from "nodemailer";
import Imap from "imap";
export const createTempEmailAccount = async () => {
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
      const Imap = require("imap");

      // Configuration for connecting to the IMAP server
      const imapConfig = {
        user: "your-email@example.com",
        password: "your-password",
        host: "imap.example.com",
        port: 993,
        tls: true,
      };

      // Create an instance of the Imap class
      const imap = new Imap(imapConfig);

      // Function to retrieve the latest email
      function retrieveLatestEmail() {
        imap.once("ready", () => {
          imap.openBox("INBOX", true, (err, box) => {
            if (err) throw err;

            // Search for the latest email
            imap.search(["UNSEEN"], (searchErr, results) => {
              if (searchErr) throw searchErr;

              const latestEmailUID = results[0];

              // Fetch the latest email
              const f = imap.fetch(latestEmailUID, { bodies: "" });

              f.on("message", (msg, seqno) => {
                console.log(`Message #${seqno}`);

                msg.on("body", (stream, info) => {
                  let buffer = "";

                  stream.on("data", (chunk) => {
                    buffer += chunk.toString("utf8");
                  });

                  stream.on("end", () => {
                    console.log(buffer);
                  });
                });

                msg.once("attributes", (attrs) => {
                  // Mark the email as read (optional)
                  imap.addFlags(latestEmailUID, "Seen", (markErr) => {
                    if (markErr) throw markErr;
                    console.log("Email marked as read.");
                  });
                });
              });

              f.once("end", () => {
                imap.end();
              });
            });
          });
        });

        imap.once("error", (err) => {
          console.error(err);
        });

        imap.once("end", () => {
          console.log("Connection ended.");
        });

        imap.connect();
      }

      // Call the function to retrieve the latest email
      retrieveLatestEmail();
    },
  };
};
