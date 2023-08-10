import Imap from "imap";

import { TempEmailAccount } from "./createTempEmailAccount";

export const fetchLatestEmail = {
  async fetchLatestEmail(tempEmailAccount: TempEmailAccount) {
    // Create an instance of the Imap class
    const imapObj = new Imap(tempEmailAccount);
    // to log in into the email inbox
    return new Promise<string>((res, rej) => {
      imapObj.once("ready", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        imapObj.openBox("INBOX", true, (err, _box) => {
          if (err) rej(err);

          // Search for the latest email
          imapObj.search(["UNSEEN"], (searchErr, results) => {
            if (searchErr) rej(searchErr);

            const latestEmailUID = results[0];

            // Fetch the latest email
            const f = imapObj.fetch(latestEmailUID, { bodies: "" });

            f.on("message", (msg, seqno) => {
              console.log(`Message #${seqno}`);

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              msg.on("body", (stream, info) => {
                let buffer = "";

                stream.on(
                  "data",
                  (chunk: { toString: (s: string) => string }) => {
                    buffer += chunk.toString("utf8");
                  },
                );

                stream.on("end", () => {
                  console.log(buffer);
                  res(buffer);
                });
              });

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              msg.once("attributes", (attrs) => {
                // Mark the email as read (optional)
                imapObj.addFlags(latestEmailUID, "Seen", (markErr) => {
                  if (markErr) rej(markErr);
                  console.log("Email marked as read.");
                });
              });
            });

            f.once("end", () => {
              imapObj.end();
            });
          });
        });
      });

      imapObj.once("error", (err: unknown) => {
        console.error("Error during imapObj operation");
        console.error(err);
      });

      imapObj.once("end", () => {
        console.log("Connection ended.");
      });

      imapObj.connect();
    });
  },
};
