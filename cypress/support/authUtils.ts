import chance from "chance";

import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import { addrs } from "./awsSesSandbox";
import { dataTestIdSelector as d } from "./dataTestIdSelector";
import { envTask } from "./envTask";
import { targetTestEnvDetailsFromEnv } from "./targetTestEnvDetailsFromEnv";
const catPrefix = "cypress.support.authUtils.";
export const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  });
};

export function withTestAccount(doThis: (tempAcct: TempEmailAccount) => void) {
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
export function submitCreateClubDetails(email: string, clubName: string) {
  cy.get(d("formCreateClubEmailAddress")).type(email);
  cy.get(d("formCreateClubClubName")).type(clubName);

  cy.get(d("recaptchaComponent"))
    .find("iframe")
    .first()
    .then((recaptchaIframe) => {
      const body = recaptchaIframe.contents();
      cy.wrap(body)
        .find(".recaptcha-checkbox-border")
        .should("be.visible")
        .click();
    });
  cy.get(d("formCreateClubSubmit")).click();
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
    submitCreateClubDetails(tempAcct.user, clubName);
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
  testFn: () => void,
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
  testFn: () => void,
) {
  /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
  // @ts-ignore
  cy.loginByCognitoApi(email, password);
  cy.visit("http://localhost:3000");
  testFn();
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
