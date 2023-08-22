import chance from "chance";

import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import { addrs } from "./awsSesSandbox";
import { dataTestIdSelector as d } from "./dataTestIdSelector";
import { envTask } from "./envTask";
import { targetTestEnvDetailsFromEnv } from "./targetTestEnvDetailsFromEnv";
export const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  });
};

function withTestAccount(doThis: (tempAcct: TempEmailAccount) => void) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    cy.task<TempEmailAccount>("createTempEmailAccount").then(
      (tempAcct: TempEmailAccount) => {
        envTask("cleanupUser", { email: tempAcct.user });
        doThis(tempAcct);
      },
    );
  } else {
    envTask("purgeSqsQueue", {
      queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
    });
    envTask("cleanupUser", {
      email: addrs.success,
    });
    doThis({ user: addrs.success });
  }
}
export function submitAddClubDetails(email: string, clubName: string) {
  cy.get(d("formAddClubEmailAddress")).type(email);
  cy.get(d("formAddClubClubName")).type(clubName);
  cy.get(d("formAddClubSubmit")).click();
}

export function withUnverifiedTempClubAdminDo(
  clubName: string,
  testRemainder: (
    tempAcct: TempEmailAccount,
    user: { userId: string; clubId: string },
  ) => void,
) {
  withTestAccount((tempAcct) => {
    cy.get(d("signUpTab")).click();
    submitAddClubDetails(tempAcct.user, clubName);
    cy.contains("email sent!");
    envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
      email: tempAcct.user,
    }).then(testRemainder.bind(null, tempAcct));
  });
}

export function withVerifiedTempClubAdminDo(
  clubName: string,
  testRemainder: (
    newPassword: string,
    tempAcct: TempEmailAccount,
    user: { userId: string; clubId: string },
  ) => void,
) {
  const newPassword = randomPassword();
  withUnverifiedTempClubAdminDo(
    clubName,
    (tempAcct: TempEmailAccount, user: { userId: string; clubId: string }) => {
      setNewPassword(tempAcct, newPassword);
      testRemainder(newPassword, tempAcct, user);
    },
  );
}
export function withPreexistingCredsDo(
  stage: string,
  email: string,
  testFn: (tempAcct: TempEmailAccount) => void,
) {
  cy.task<Record<"password", string>>("fetchSecret", {
    ...targetTestEnvDetailsFromEnv,
    secretName: `${stage}.automatedTestUserPassword.${email}`,
  }).then(({ password }) => {
    withCredentialsRun(email, password, testFn);
  });
}

export function withCredentialsRun(
  email: string,
  password: string,
  testFn: (tempAcct: TempEmailAccount) => void,
) {
  /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
  // @ts-ignore
  cy.loginByCognitoApi(email, password);
  cy.visit("http://localhost:3000");
  withTestAccount((t) => testFn(t));
}

export function setNewPassword(
  tempAcct: TempEmailAccount,
  newPassword: string,
) {
  return envTask("setNewPasswordViaAdmin", {
    email: tempAcct.user,
    newPassword,
  });
}
