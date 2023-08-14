import { dataTestIdSelector as d } from "./dataTestIdSelector";

export function refreshSignupTab() {
  cy.get(d("signInTab")).click();
  cy.get(d("signUpTab")).click();
}
