import { fullAddClubTest } from "../support/fullAddClubTest";
import requiredEnvVar from "../support/requiredEnvVar";

describe("addClub new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
  it("passes happy path with API_KEY", () => {
    fullAddClubTest();
  });

  it("passes happy path with adminSuper", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cy.loginByCognitoApi(
      requiredEnvVar("cognito_username"),
      requiredEnvVar("cognito_password"),
    );
    fullAddClubTest();
  });

  // TODO: add secure password retrieval from secrets and scripts to auto-create cognito test users per-env
});
