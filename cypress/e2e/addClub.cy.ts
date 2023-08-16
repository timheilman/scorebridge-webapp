import {
  runAddClubHappyPath,
  runAddClubHappyPathFull,
  runAddClubSadPath,
  withTestAccount,
} from "../support/fullAddClubTest";
import requiredEnvVar from "../support/requiredEnvVar";

describe("signUp new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
  it("passes happy path with API_KEY", () => {
    cy.visit("http://localhost:3000");
    withTestAccount((t) => runAddClubHappyPathFull(t));
  });

  it("passes happy path with adminSuper", () => {
    cy.loginByCognitoApi(
      requiredEnvVar("COGNITO_USERNAME_ADMIN_SUPER"),
      requiredEnvVar("COGNITO_PASSWORD_ADMIN_SUPER"),
    );
    cy.visit("http://localhost:3000");
    withTestAccount((t) => runAddClubHappyPath(t));
  });

  it("fails auth with clubAdmin", () => {
    cy.loginByCognitoApi(
      requiredEnvVar("COGNITO_USERNAME_ADMIN_CLUB"),
      requiredEnvVar("COGNITO_PASSWORD_ADMIN_CLUB"),
    );
    cy.visit("http://localhost:3000");
    withTestAccount((t) => runAddClubSadPath(t));
  });
  // TODO: add secure password retrieval from secrets and scripts to auto-create cognito test players per-env
});
