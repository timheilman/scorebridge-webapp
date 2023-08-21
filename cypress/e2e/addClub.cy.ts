import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import {
  runAddClubHappyPath,
  runAddClubHappyPathFull,
  withTestAccount,
} from "../support/fullAddClubTest";
import requiredEnvVar from "../support/requiredEnvVar";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";

function withCredentialsRun(
  stage: string,
  email: string,
  testFn: (
    tempEmailAccount:
      | TempEmailAccount
      | {
          user: string;
        },
  ) => void,
) {
  cy.task<Record<"password", unknown>>("fetchSecret", {
    ...targetTestEnvDetailsFromEnv,
    secretName: `${stage}.automatedTestUserPassword.${email}`,
  }).then(({ password }) => {
    /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment */
    // @ts-ignore
    cy.loginByCognitoApi(email, password);
    cy.visit("http://localhost:3000");
    cy.get(d("superChickenModeButton")).click();
    withTestAccount((t) => testFn(t));
  });
}

describe("signUp new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
  it("passes happy path with API_KEY", () => {
    cy.visit("http://localhost:3000");
    withTestAccount((t) => runAddClubHappyPathFull(t));
  });

  it("passes happy path with adminSuper", () => {
    const stage = requiredEnvVar("STAGE");
    const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
    withCredentialsRun(stage, email, runAddClubHappyPath);
  });
});
