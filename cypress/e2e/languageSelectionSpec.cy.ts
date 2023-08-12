/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/data-test-id-selector";

// TODO: de-hardcode the "from" email address to be per-env
// TODO: use better verbiage for signup email (cypress test addClubSpec will break!)
// TODO: validate input parameters to addClub form
// TODO: get disciplined about translations
// TODO: expect a generic error message and request to look in console if testing env target is prod
// TODO: provide means to delete all users with an ethereal email address
// TODO: make locale selection tiny flags across top
// TODO: point to "forgot password" when addClub invoked on pre-existing confirmed email
// TODO: look into test coverage; otherwise manually verify coverage
// TODO: learn to write the task to, if too fast, retry within a timeout, rather than cy.wait()
// TODO: write a logging system w/categories like log4j and cleanup the logging chatter
// TODO: increase the refresh token expiration to 10 years only for tableTablets
// TODO: rename tableTablets to tableDevices
// TODO: right to be forgotten: UI for it, starting with removeClubAndUser
describe("initial load of page", () => {
  it("Handles language detection then override after reload", () => {
    cy.task("log", "Hi Mom!  gnu11");
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
});
