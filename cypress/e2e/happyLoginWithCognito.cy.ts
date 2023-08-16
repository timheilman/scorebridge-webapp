// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import requiredEnvVar from "../support/requiredEnvVar";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";

describe("trying custom command to login programmatically with cognito", () => {
  it("can login", () => {
    // cy.visit("http://localhost:3000/");
    cy.loginByCognitoApi(
      requiredEnvVar("cognito_username"),
      requiredEnvVar("cognito_password"),
    );
    cy.contains("This is the table tablets page placeholder").should(
      "be.visible",
    );
  });
});
