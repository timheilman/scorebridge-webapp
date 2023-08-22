import {
  randomPassword,
  setNewPassword,
  submitAddClubDetails,
  withCredentialsRun,
  withPreexistingCredsDo,
  withUnverifiedTempClubAdminDo,
  withVerifiedTempClubAdminDo,
} from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { verifyReceivedEmail } from "../support/emailUtils";
import { envTask } from "../support/envTask";
import { refreshSignupTab } from "../support/refreshSignupTab";
import requiredEnvVar from "../support/requiredEnvVar";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";
import { expectBackendDetails, expectDdbDetails } from "../support/userUtils";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";

const stage = requiredEnvVar("STAGE");

const originalClubName = "original club name should be created in club table";
const updatedClubName = "updated name should be stored in club table";
const failedClubName =
  "name should not be updated in club table upon invocation by confirmed user";

describe("signUp and self-account-deletion", () => {
  it("with API_KEY, signUp new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    cy.visit("http://localhost:3000");
    const newPassword = randomPassword();
    withUnverifiedTempClubAdminDo(originalClubName, (tempAcct, user) => {
      verifyReceivedEmail(tempAcct);

      expectBackendDetails(user, tempAcct, originalClubName);
      refreshSignupTab();

      submitAddClubDetails(tempAcct.user, updatedClubName);
      cy.contains("email sent!");
      verifyReceivedEmail(tempAcct);
      expectDdbDetails(user, tempAcct, updatedClubName);

      setNewPassword(tempAcct, newPassword);
      refreshSignupTab();
      submitAddClubDetails(tempAcct.user, failedClubName);
      cy.contains(
        `That email address has already been registered.  Please use the SIGN IN tab and choose "forgot password"`,
      );
      if (targetTestEnvDetailsFromEnv.stage === "prod") {
        cy.task("fetchEmailsExpectingNone", tempAcct);
      } else {
        envTask("receiveMessagesFromSqs", {
          queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
        }).should("be.empty");
      }
      expectDdbDetails(user, tempAcct, updatedClubName); // NOT failedClubName
    });
  });

  it("passes happy path with adminSuper", () => {
    const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
    withPreexistingCredsDo(stage, email, (tempAcct: TempEmailAccount) => {
      cy.visit("http://localhost:3000/");
      const clubName = "Ace of Clubs";
      cy.get(d("superChickenModeTab")).click();
      submitAddClubDetails(tempAcct.user, clubName);
      cy.contains("email sent!");
      verifyReceivedEmail(tempAcct);
      envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
        email: tempAcct.user,
      }).then((user) => {
        expectBackendDetails(user, tempAcct, clubName);
      });
    });
  });

  it("actually-deletes things when account deleted", () => {
    withVerifiedTempClubAdminDo(
      originalClubName,
      (newPassword, tempAcct, user) => {
        verifyReceivedEmail(tempAcct);
        expectBackendDetails(user, tempAcct, originalClubName);
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
      },
    );
  });
});
