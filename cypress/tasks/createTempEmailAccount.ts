import { createTestAccount } from "nodemailer";
export type TempEmailAccount = {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
};
export const createTempEmailAccount = {
  async createTempEmailAccount(): Promise<TempEmailAccount> {
    console.log("Creating email account...");
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
  },
};
