import {
  withCredentialsRun,
  withVerifiedTempClubAdminDo,
} from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { verifyReceivedEmail } from "../support/emailUtils";
import { expectBackendDetails } from "../support/userUtils";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";

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
        (_t: TempEmailAccount) => {
          cy.get(d("forgetMeTab")).click();
          cy.get(d("formForgetMeConfirm")).type("Delete my account");
          cy.get(d("formForgetMeSubmit")).click();
          cy.contains("SIGN IN");
          cy.contains("Username");
          cy.contains("Password");
        },
      );
      // todo: verifications of null for backend, need to revamp expect tasks to fetchNullable instead
    });
  });
});
