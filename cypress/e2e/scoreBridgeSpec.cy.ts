/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

// TODO: change API response for addClub to indicate 3 prongs: created user & club, reinvited user & updated club name, or try "forgot password" instead
// TODO: fix that the signUp page is too wide
// TODO: verify using the ethereal email service that the email contains the verbiage we want (it doesn't yet; TDD)
// TODO: rename club to organization
// TODO: validate input parameters to addClub form

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function d(s: string): string {
  return `[data-test-id=${s}]`;
}
describe("initial load of page", () => {
  xit("Handles language detection then override after reload", () => {
    cy.visit("http://localhost:3000");
    // language en is forced for Electron launch regardless of test running machine's locale
    cy.contains("Admin Portal"); // outside Authenticator component
    cy.contains("Username"); // inside Authenticator component
    cy.get(d("languageSelectorDropdown")).find(":selected").contains("English");
    cy.get(d("languageSelectorDropdown")).select("Français");
    cy.contains("Portail D'administration");
    cy.contains("Nom d'utilisateur");
    cy.get(d("languageSelectorDropdown"))
      .find(":selected")
      .contains("Français");
    cy.reload();
    cy.contains("Portail D'administration");
    cy.contains("Nom d'utilisateur");
  });
  it("sends an email when a new email address is entered ", () => {
    cy.task("log", "Output me to the terminal");
    cy.visit("http://localhost:3000");
    cy.get(d("signUpTab")).click();
    cy.get(d("formAddClubEmailAddress")).type(
      "tdh+scoreBridge-first-cypress-email@stanfordalumni.org",
    );
    cy.get(d("formAddClubClubName")).type("definitely updated name");
    // WARNING!  The following actually-sends an email, and there is a daily quota with cognito
    // you can work around it by explicitly configuring integration with their email
    // service, but I would rather not.  Tested once manually.
    //
    cy.get(d("formAddClubSubmit")).click();
    cy.contains("email sent!");
  });
});
