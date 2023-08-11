/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import chance from "chance";

import { dataTestIdSelector as d } from "../support/data-test-id-selector";
import requiredEnvVar from "../support/requiredEnvVar";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";
// WARNING!  The following actually-sends emails, and there is a daily quota with cognito
// you can work around it by explicitly configuring integration with their email
// service, but I would rather not.

const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  });
};
describe("submit button behavior on addClub form", () => {
  beforeEach(() => {
    cy.task<TempEmailAccount>("createTempEmailAccount")
      .then((tempEmailAccount: TempEmailAccount) => {
        cy.task("cleanupUser", {
          profile: requiredEnvVar("SB_TEST_AWS_CLI_PROFILE"),
          awsRegion: requiredEnvVar("AWS_REGION"),
          poolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
          email: tempEmailAccount.user,
          userTableName: requiredEnvVar("USERS_TABLE"),
          clubTableName: requiredEnvVar("CLUBS_TABLE"),
        });

        return Promise.resolve(tempEmailAccount);
      })
      .as("tempEmailAccount");
  });
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cy.get<TempEmailAccount>("@tempEmailAccount").then((tempEmailAccount) => {
      cy.visit("http://localhost:3000");
      cy.get(d("signUpTab")).click();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type("original name");
      cy.get(d("formAddClubSubmit")).click();
      cy.contains("email sent!");
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500); // TODO: learn to write the task to, if too fast, retry within a timeout, rather than this
      cy.task("fetchLatestEmail", tempEmailAccount).should(
        "include",
        `Your username is ${tempEmailAccount.user} and temporary password is`,
      );

      cy.get(d("signInTab")).click();
      cy.get(d("signUpTab")).click();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type("original name");
      cy.get(d("formAddClubSubmit")).click();
      cy.contains("email sent!");
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500); // TODO: learn to write the task to, if too fast, retry within a timeout, rather than this
      cy.task("fetchLatestEmail", tempEmailAccount).should(
        "include",
        `Your username is ${tempEmailAccount.user} and temporary password is`,
      );

      cy.task("fetchEmailsExpectingNone", tempEmailAccount);

      const newPassword = randomPassword();
      cy.task("setNewPasswordViaAdmin", {
        profile: requiredEnvVar("SB_TEST_AWS_CLI_PROFILE"),
        awsRegion: requiredEnvVar("AWS_REGION"),
        poolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
        email: tempEmailAccount.user,
        newPassword,
      });

      cy.get(d("signInTab")).click();
      cy.get(d("signUpTab")).click();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type("original name");
      cy.get(d("formAddClubSubmit")).click();
      cy.contains(
        `An account has already been registered under this email address: ${tempEmailAccount.user}.`,
      );
    });
  });
});
