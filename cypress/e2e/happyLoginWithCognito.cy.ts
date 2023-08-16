// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import requiredEnvVar from "../support/requiredEnvVar";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";

describe("trying custom command to login programmatically with cognito", () => {
  it("can login", () => {
    cy.visit("http://localhost:3000/");
    cy.task("loginByCognitoApi", {
      ...targetTestEnvDetailsFromEnv,
      username: requiredEnvVar("cognito_username"),
      password: requiredEnvVar("cognito_password"),
    });
    cy.contains("Projects").should("be.visible");
  });
});
