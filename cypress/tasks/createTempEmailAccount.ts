import { createTestAccount } from "nodemailer";

import { logFn } from "../../src/lib/logging";
const log = logFn("cypress.tasks.createTempEmailAccount.");
export interface TempEmailAccount {
  user: string;
  password?: string;
  host?: string;
  port?: number;
  tls?: boolean;
}
export const createTempEmailAccount = async (): Promise<TempEmailAccount> => {
  log("createTempEmailAccount.start", "debug");
  const testAccount = await createTestAccount();
  const { user, pass, imap } = testAccount;
  const { host, port, secure } = imap;
  // Configuration for connecting to the IMAP server
  const imapConfig = {
    user,
    password: pass,
    host,
    port,
    tls: secure,
  };

  return imapConfig;
};
