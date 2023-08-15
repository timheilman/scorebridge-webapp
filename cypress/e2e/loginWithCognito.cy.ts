// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
describe("trying custom command to login programmatically with cognito", () => {
  beforeEach(() => {
    cy.loginByCognitoApi(
      Cypress.env("cognito_username"),
      Cypress.env("cognito_password"),
    );
  });
  it("can login", () => {
    cy.contains("Get Started").should("be.visible");
  });
});
