import { fullAddClubTest } from "../support/fullAddClubTest";
import requiredEnvVar from "../support/requiredEnvVar";

describe("trying custom command to login programmatically with cognito", () => {
  it("can login", () => {
    cy.loginByCognitoApi(
      requiredEnvVar("cognito_username"),
      requiredEnvVar("cognito_password"),
    );
    fullAddClubTest();
  });
});
