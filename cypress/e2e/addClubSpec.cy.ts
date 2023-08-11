/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/data-test-id-selector";
import chance from "chance";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import requiredEnvVar from "../support/requiredEnvVar";
// WARNING!  The following actually-sends emails, and there is a daily quota with cognito
// you can work around it by explicitly configuring integration with their email
// service, but I would rather not.

const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  }) as string;
};
describe("submit button behavior on addClub form", () => {
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    cy.task("createTempEmailAccount").then(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (tempEmailAccount: TempEmailAccount) => {
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
          awsRegion: requiredEnvVar("REACT_APP_AWS_REGION"),
          poolId: requiredEnvVar("REACT_APP_COGNITO_USER_POOL_ID"),
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
      },
    );
  });
});
