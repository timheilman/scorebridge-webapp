import Imap, { Config } from "imap";

import { logFn } from "../../src/lib/logging";
import { TempEmailAccount } from "./createTempEmailAccount";
const log = logFn("cypress.tasks.fetchLatestEmail.");
export const fetchLatestEmail = async (tempEmailAccount: TempEmailAccount) => {
  let latestEmail;
  try {
    latestEmail = await fetchLatestEmailThrowing(tempEmailAccount);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.message === "Nothing to fetch") {
      return null;
    }
  }

  throw new Error(`Expected nothing to fetch but fetched ${latestEmail}`);
};

const fetchLatestEmailThrowing = async (tempEmailAccount: TempEmailAccount) => {
  // Create an instance of the Imap class
  const imapObj = new Imap(tempEmailAccount as Config);
  // to log in into the email inbox
  return new Promise<string>((res, rej) => {
    imapObj.once("ready", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      imapObj.openBox("INBOX", true, (err, _box) => {
        if (err) {
          rej(err);
          return;
        }

        // Search for the latest email
        imapObj.search(["UNSEEN"], (searchErr, results) => {
          if (searchErr) {
            rej(searchErr);
            return;
          }

          const latestEmailUID = results[0];

          // Fetch the latest email
          let f: Imap.ImapFetch;
          try {
            f = imapObj.fetch(latestEmailUID, { bodies: "" });
          } catch (e) {
            rej(e);
            return;
          }

          f.on("message", (msg, seqno) => {
            log("imap.onMessage", "debug", { seqno });

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
                log("imap.onBodyStreamEnd", "debug", { buffer });
                res(buffer);
              });
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            msg.once("attributes", (attrs) => {
              // Mark the email as read (optional)
              imapObj.addFlags(latestEmailUID, "Seen", (markErr) => {
                if (markErr) {
                  rej(markErr);
                  return;
                }
                log("imap.markedAsRead", "debug");
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
      log("imap.onError", "error", err);
    });

    imapObj.once("end", () => {
      log("imap.onConnectionEnd", "debug");
    });

    imapObj.connect();
  });
};
