import {
  randomPassword,
  setNewPassword,
  submitAddClubDetails,
  withCredentialsRun,
  withPreexistingCredsDo,
  withTestAccount,
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

const stage = requiredEnvVar("STAGE");

const originalClubName = "original club name should be created in club table";
const updatedClubName = "updated name should be stored in club table";
const failedClubName =
  "name should not be updated in club table upon invocation by confirmed user";

describe("signUp", () => {
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

  it("with adminSuper, passes happy path", () => {
    const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
    withPreexistingCredsDo(stage, email, () => {
      withTestAccount((tempAcct) => {
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
  });
});
