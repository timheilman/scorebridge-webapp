import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
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
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cy.loginByCognitoApi(
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      requiredEnvVar("COGNITO_USERNAME_ADMIN_SUPER"),
      requiredEnvVar("COGNITO_PASSWORD_ADMIN_SUPER"),
    );
    cy.visit("http://localhost:3000");
    cy.get(d("superChickenModeButton")).click();
    withTestAccount((t) => runAddClubHappyPath(t));
  });

  it("fails auth with clubAdmin", () => {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cy.loginByCognitoApi(
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      requiredEnvVar("COGNITO_USERNAME_ADMIN_CLUB"),
      requiredEnvVar("COGNITO_PASSWORD_ADMIN_CLUB"),
    );
    cy.visit("http://localhost:3000");
    cy.get(d("superChickenModeButton")).click();
    withTestAccount((t) => runAddClubSadPath(t));
  });
  // TODO: add secure password retrieval from secrets and scripts to auto-create cognito test players per-env
});
