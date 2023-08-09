/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
describe("sign up tab", () => {
  it("sends an email when a new email address is entered ", () => {
    cy.task("log", "Output me to the terminal");
    cy.visit("http://localhost:3000");
    cy.get("[data-test-id=signUpTab]").click();
    cy.get("[data-test-id=formAddClubEmailAddress]").type(
      "tdh+scoreBridge-first-cypress-email@stanfordalumni.org",
    );
    cy.get("[data-test-id=formAddClubClubName]").type(
      "first cypress addClub invocation club name",
    );
    // WARNING!  This actually-sends an email, and there is a daily quota with cognito
    // you can work around it by explicitly configuring integration with their email
    // service, but I would rather not.  Tested once manually.
    //
    // cy.get("[data-test-id=formAddClubSubmit]").click();
    // cy.contains("email sent!");
  });
  it("handles language detection and selection correctly", () => {
    // -- inside and outside Authenticator component
    cy.visit("http://localhost:3000");
  });
  // then, test switching language w/switcher to English
  // -- immediately inside & outside Authenticator component
  // -- after browser reload, despite default still French
  // TODO: fix that re-signing-up the same email address gives an error
  // TODO: verify that the error (e.g. the one making re-sign-up the same email address) shows on-screen
});
