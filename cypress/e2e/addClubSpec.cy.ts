/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import chance from "chance";

import { dataTestIdSelector as d } from "../support/data-test-id-selector";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import requiredEnvVar from "../tasks/lib/requiredEnvVar";
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

function refreshSignupTab() {
  cy.get(d("signInTab")).click();
  cy.get(d("signUpTab")).click();
}

const provideFromEnv = {
  profile: requiredEnvVar("SB_TEST_AWS_CLI_PROFILE"),
  awsRegion: requiredEnvVar("AWS_REGION"),
  poolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
  userTableName: requiredEnvVar("USERS_TABLE"),
  clubTableName: requiredEnvVar("CLUBS_TABLE"),
};

describe("submit button behavior on addClub form", () => {
  beforeEach(() => {
    cy.task<TempEmailAccount>("createTempEmailAccount")
      .then((tempEmailAccount: TempEmailAccount) => {
        cy.task("cleanupUser", {
          ...provideFromEnv,
          email: tempEmailAccount.user,
        });

        return Promise.resolve(tempEmailAccount);
      })
      .as("tempEmailAccount");
  });
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    const originalClubName =
      "original club name should be created in club table";
    const updatedClubName = "updated name should be stored in club table";
    const failedClubName =
      "name should not be updated in club table upon invocation by confirmed user";
    cy.get<TempEmailAccount>("@tempEmailAccount").then((tempEmailAccount) => {
      cy.visit("http://localhost:3000");
      cy.get(d("signUpTab")).click();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type(originalClubName);
      cy.get(d("formAddClubSubmit")).click();
      cy.contains("email sent!");
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.task("fetchLatestEmail", tempEmailAccount).should(
        "include",
        `Your username is ${tempEmailAccount.user} and temporary password is`,
      );
      cy.task("expectClubName", {
        ...provideFromEnv,
        email: tempEmailAccount.user,
        expectedClubName: originalClubName,
      });
      refreshSignupTab();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type(updatedClubName);
      cy.get(d("formAddClubSubmit")).click();
      cy.contains("email sent!");
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.task("fetchLatestEmail", tempEmailAccount).should(
        "include",
        `Your username is ${tempEmailAccount.user} and temporary password is`,
      );
      cy.task("expectClubName", {
        ...provideFromEnv,
        email: tempEmailAccount.user,
        expectedClubName: updatedClubName,
      });

      const newPassword = randomPassword();
      cy.task("setNewPasswordViaAdmin", {
        ...provideFromEnv,
        email: tempEmailAccount.user,
        newPassword,
      });

      refreshSignupTab();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type(failedClubName);
      cy.get(d("formAddClubSubmit")).click();
      cy.contains(
        `An account has already been registered under this email address: ${tempEmailAccount.user}.`,
      );
      cy.task("fetchEmailsExpectingNone", tempEmailAccount);
      cy.task("expectClubName", {
        ...provideFromEnv,
        email: tempEmailAccount.user,
        expectedClubName: updatedClubName, // NOT failedClubName
      });
    });
  });
});
