// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { withPreexistingCredsDo } from "../support/authUtils";
import requiredEnvVar from "../support/requiredEnvVar";
const stage = requiredEnvVar("STAGE");

describe("load of special on-purpose unexpected error page", () => {
  it("for adminSuper only, identifies the error type and displays its message", () => {
    const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
    withPreexistingCredsDo(stage, email, () => {
      cy.visit("http://localhost:3000/unexpected_error");
      cy.contains(
        "This error is a synthetic unexpected error from a lambda implementation.",
      );
      cy.contains('"errorType": "UnexpectedError"');
    });
  });
});
