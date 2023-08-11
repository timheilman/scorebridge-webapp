/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/data-test-id-selector";

// TODO: fix rerunnability of addClub test: use beforeEach to ensure cognito user, ddb user, ddb club all deleted
// (right now email acct is cached per-process so a rerun says it's already confirmed)
// TODO: fix that the signUp page is too wide
// TODO: complete exhaustive testing of all addClub, including 1) unexpected error, 2) happy path, 3) happy remind path, 4) already-confirmed error path
// TODO: use better verbiage for signup email (cypress test addClubSpec will break!)
// TODO: validate input parameters to addClub form
// TODO: get disciplined about translations
// TODO: expect a generic error message and request to look in console if testing env target is prod
// TODO: provide means to mark users as synthetic for easy deletion, and easy deletion means
// TODO: make locale selection tiny flags across top
// TODO: point to "forgot password" when addClub invoked on pre-existing confirmed email
// TODO: look into test coverage; otherwise manually verify coverage

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
