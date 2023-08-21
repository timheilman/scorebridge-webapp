import { dataTestIdSelector as d } from "../support/dataTestIdSelector";

const frenchTitle = "Portail d'administration";
const frenchUsernamePrompt = "Nom d'utilisateur";
describe("initial load of page", () => {
  it("Handles language detection then override after reload", () => {
    cy.visit("http://localhost:3000");
    // language en is forced for Electron launch regardless of test running machine's locale
    cy.contains("Admin Portal"); // outside Authenticator component
    cy.contains("Username"); // inside Authenticator component
    cy.get(d("languageSelectorDropdown")).find(":selected").contains("English");
    cy.get(d("languageSelectorDropdown")).select("Français");
    cy.contains(frenchTitle);
    cy.contains(frenchUsernamePrompt);
    cy.get(d("languageSelectorDropdown"))
      .find(":selected")
      .contains("Français");
    cy.reload();
    cy.contains(frenchTitle);
    cy.contains(frenchUsernamePrompt);
  });
});
