/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import chance from "chance";

import { addrs } from "../support/awsSesSandbox";
import { dataTestIdSelector as d } from "../support/data-test-id-selector";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import { targetTestEnvDetailsFromEnv } from "../tasks/lib/targetTestEnvDetailsFromEnv";
// WARNING!  The following actually-sends emails, and there is a daily quota with cognito
// you can work around it by explicitly configuring integration with their email
// service, but I would rather not.

const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  });
};

function refreshSignupTab() {
  cy.get(d("signInTab")).click();
  cy.get(d("signUpTab")).click();
}

function verifyReceivedEmail(tempEmailAccount: TempEmailAccount) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    cy.task("fetchLatestEmail", tempEmailAccount).should(
      "include",
      `Your username is ${tempEmailAccount.user} and temporary password is`,
    );
  } else {
    cy.task<string>("receiveMessageFromSqs", {
      ...targetTestEnvDetailsFromEnv,
      queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
    }).then((parsedSqs: string) => {
      const parsedMessage = JSON.parse(
        JSON.parse(parsedSqs).Message as string,
      ) as {
        mail: { headers: { name: string; value: string }[] };
      };
      expect(
        parsedMessage.mail.headers.find((h) => h?.name === "Subject")?.value,
      ).to.match(/Your temporary password/);
    });
  }
}

describe("submit button behavior on addClub form", () => {
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    const originalClubName =
      "original club name should be created in club table";
    const updatedClubName = "updated name should be stored in club table";
    const failedClubName =
      "name should not be updated in club table upon invocation by confirmed user";
    // BEGIN_WORKAROUND_BEFORE_BLOCK cypress runs before blocks twice if they're async :(
    if (targetTestEnvDetailsFromEnv.stage === "prod") {
      cy.task<TempEmailAccount>("createTempEmailAccount")
        .then((tempEmailAccount: TempEmailAccount) => {
          cy.task("cleanupUser", {
            ...targetTestEnvDetailsFromEnv,
            email: tempEmailAccount.user,
          });

          return Promise.resolve(tempEmailAccount);
        })
        .as("tempEmailAccount");
    } else {
      cy.task("purgeSqsQueue", {
        queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
        ...targetTestEnvDetailsFromEnv,
      });
      cy.task("cleanupUser", {
        ...targetTestEnvDetailsFromEnv,
        email: addrs.success,
      })
        .then(() => {
          return Promise.resolve({ user: addrs.success });
        })
        .as("tempEmailAccount");
    }
    // END_WORKAROUND_BEFORE_BLOCK
    cy.get<TempEmailAccount>("@tempEmailAccount").then((tempEmailAccount) => {
      cy.visit("http://localhost:3000");
      cy.get(d("signUpTab")).click();
      cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
      cy.get(d("formAddClubClubName")).type(originalClubName);
      cy.get(d("formAddClubSubmit")).click();
      cy.contains("email sent!");
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      verifyReceivedEmail(tempEmailAccount);
      cy.task<{ userId: string; clubId: string }>("fetchNullableUser", {
        ...targetTestEnvDetailsFromEnv,
        email: tempEmailAccount.user,
      }).then((user) => {
        if (!user) {
          throw new Error(`No user found for email ${tempEmailAccount.user}`);
        }
        cy.task("fetchGroupsForUser", {
          ...targetTestEnvDetailsFromEnv,
          userId: user.userId,
        }).then((groupNames) => {
          expect(groupNames).to.contain("adminClub");
        });
        const arg = {
          ...targetTestEnvDetailsFromEnv,
          clubId: user.clubId,
          expectedClubName: originalClubName,
        };
        cy.task("expectClubName", arg);
        refreshSignupTab();
        cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
        cy.get(d("formAddClubClubName")).type(updatedClubName);
        cy.get(d("formAddClubSubmit")).click();
        cy.contains("email sent!");
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        verifyReceivedEmail(tempEmailAccount);
        cy.task("expectClubName", {
          ...targetTestEnvDetailsFromEnv,
          clubId: user.clubId,
          expectedClubName: updatedClubName,
        });

        const newPassword = randomPassword();
        cy.task("setNewPasswordViaAdmin", {
          ...targetTestEnvDetailsFromEnv,
          email: tempEmailAccount.user,
          newPassword,
        });

        refreshSignupTab();
        cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
        cy.get(d("formAddClubClubName")).type(failedClubName);
        cy.get(d("formAddClubSubmit")).click();
        cy.contains(
          `An account has already been registered under this email address: ${tempEmailAccount.user}.`,
        );
        if (targetTestEnvDetailsFromEnv.stage === "prod") {
          cy.task("fetchEmailsExpectingNone", tempEmailAccount);
        } else {
          cy.task("receiveMessagesExpectingNone", {
            ...targetTestEnvDetailsFromEnv,
            queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
          });
        }
        cy.task("expectClubName", {
          ...targetTestEnvDetailsFromEnv,
          clubId: user.clubId,
          expectedClubName: updatedClubName, // NOT failedClubName
        });
      });
    });
  });
});
