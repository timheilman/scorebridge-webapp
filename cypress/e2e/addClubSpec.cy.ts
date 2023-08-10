/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/data-test-id-selector";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";
// WARNING!  The following actually-sends emails, and there is a daily quota with cognito
// you can work around it by explicitly configuring integration with their email
// service, but I would rather not.

describe("sign up tab", () => {
  it("sends an email when a new email address is entered ", () => {
    cy.task("log", "Output me to the terminal");
    cy.task("createTempEmailAccount").then(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (tempEmailAccount: TempEmailAccount) => {
        cy.visit("http://localhost:3000");
        cy.get(d("signUpTab")).click();
        cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
        cy.get(d("formAddClubClubName")).type("definitely re-renamed name");
        cy.get(d("formAddClubSubmit")).click();
        cy.contains("email sent!");
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.task("fetchLatestEmail", tempEmailAccount).should(
          "include",
          `Your username is ${tempEmailAccount.user} and temporary password is`,
        );
      },
    );
  });
});
