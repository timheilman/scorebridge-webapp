import { withPreexistingCredsDo } from "../support/authUtils";
import { envTask } from "../support/envTask";
import requiredCypressEnvVar from "../support/requiredCypressEnvVar";
const stage = requiredCypressEnvVar("STAGE");

describe("load of special on-purpose unexpected error page", () => {
  beforeEach(() => {
    envTask("logoutByCognitoApi", {});
  });
  it("for adminSuper only, identifies the error type and displays its message", () => {
    const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
    withPreexistingCredsDo(stage, email, () => {
      cy.visit("http://localhost:5173/unexpected_error");
      cy.contains(
        "This error is a synthetic unexpected error from a lambda implementation.",
      );
      cy.contains('"errorType":"UnexpectedError"');
    });
  });
});
