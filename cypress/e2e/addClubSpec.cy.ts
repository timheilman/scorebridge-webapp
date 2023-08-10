/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/data-test-id-selector";
// WARNING!  The following actually-sends emails, and there is a daily quota with cognito
// you can work around it by explicitly configuring integration with their email
// service, but I would rather not.

describe("sign up tab", () => {
  it("sends an email when a new email address is entered ", () => {
    cy.task("log", "Output me to the terminal");
    cy.visit("http://localhost:3000");
    cy.get(d("signUpTab")).click();
    cy.get(d("formAddClubEmailAddress")).type(
      "tdh+scoreBridge-first-cypress-email@stanfordalumni.org",
    );
    cy.get(d("formAddClubClubName")).type("definitely re-renamed name");
    //
    cy.get(d("formAddClubSubmit")).click();
    cy.contains("email sent!");
  });
});
