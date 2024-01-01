import {
  withCredentialsRun,
  withVerifiedTempClubAdminDo,
} from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { verifyReceivedEmail } from "../support/emailUtils";
import { envTask } from "../support/envTask";
import { expectBackendDetails } from "../support/userUtils";

describe("trying to speed up cypress", () => {
  beforeEach(() => {
    envTask("logoutByCognitoApi", {});
  });
  it("actually-deletes things when account deleted", () => {
    const clubName = "My club";
    cy.visit("http://localhost:5173/");
    withVerifiedTempClubAdminDo(clubName, (newPassword, tempAcct, user) => {
      verifyReceivedEmail(tempAcct);
      expectBackendDetails(user, tempAcct, clubName);

      withCredentialsRun(
        tempAcct.user,
        newPassword,

        () => {
          cy.get(d("forgetMeTab")).click();
          cy.get(d("formForgetMeConfirm")).type("Delete my account");
          cy.task("log", {
            catPrefix: "cypress.e2e.justDeleteClubAndAdmin.",
            catSuffix: "beforeClick",
            logLevel: "info",
            addlParams: [user],
          });
          cy.get(d("formForgetMeSubmit")).click();
          cy.contains("Sign In"); // capitalized with CSS magic, but this capitalization in source
          cy.contains("Username");
          cy.contains("Password");

          // expect account deletion:
          envTask("expectDdbUserDetails", {
            userId: user.userId,
            expectedUserDetails: null,
          });
          envTask("expectClubDetails", {
            clubId: user.clubId,
            expectedClubDetails: null,
          });
          envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
            email: tempAcct.user,
          }).then((user) => {
            expect(user).to.be.null;
          });
        },
      );
    });
  });
});
