/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";

describe("initial load of page", () => {
  it("Handles language detection then override after reload", () => {
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
