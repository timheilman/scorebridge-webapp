import {
  withCredentialsRun,
  withVerifiedTempClubAdminDo,
} from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { verifyReceivedEmail } from "../support/emailUtils";
import { expectBackendDetails } from "../support/userUtils";

describe("trying to speed up cypress", () => {
  it("actually-deletes things when account deleted", () => {
    const clubName = "My club";
    cy.visit("http://localhost:3000/");
    withVerifiedTempClubAdminDo(clubName, (newPassword, tempAcct, user) => {
      verifyReceivedEmail(tempAcct);
      expectBackendDetails(user, tempAcct, clubName);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      withCredentialsRun(
        tempAcct.user,
        newPassword,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        () => {
          cy.get(d("forgetMeTab")).click();
          cy.get(d("formForgetMeConfirm")).type("Delete my account");
          cy.task("log", {
            catPrefix: "cypress.e2e.justRemoveClubAndAdmin.",
            catSuffix: "beforeClick",
            logLevel: "info",
            addlParams: [user],
          });
          cy.get(d("formForgetMeSubmit")).click();
          cy.contains("Sign In"); // capitalized with CSS magic, but this capitalization in source
          cy.contains("Username");
          cy.contains("Password");
        },
      );
      // todo: verifications of null for backend, need to revamp expect tasks to fetchNullable instead
    });
  });
});
