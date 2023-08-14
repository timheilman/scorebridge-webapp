/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import chance from "chance";

import { addrs } from "../support/awsSesSandbox";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import { refreshSignupTab } from "../support/refreshSignupTab";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";
import { TempEmailAccount } from "../tasks/createTempEmailAccount";

const randomPassword = () => {
  const pool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";

  return chance().string({
    length: 8,
    pool,
  });
};

function verifyReceivedEmail(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.task("fetchLatestEmail", tempEmailAccount).should(
      "include",
      `Your username is ${tempEmailAccount.user} and temporary password is`,
    );
  } else {
    envTask<string[]>("receiveMessagesFromSqs", {
      queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
    }).then((unparsedSqses: string[]) => {
      expect(unparsedSqses.length).to.equal(1);
      const parsedMessage = JSON.parse(
        JSON.parse(unparsedSqses[0]).Message as string,
      ) as {
        mail: { headers: { name: string; value: string }[] };
      };
      expect(
        parsedMessage.mail.headers.find((h) => h?.name === "Subject")?.value,
      ).to.match(
        new RegExp(
          `Welcome to the ScoreBridge-${targetTestEnvDetailsFromEnv.stage} App`,
        ),
      );
    });
  }
}

function runAddClubHappyPath(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  const originalClubName = "original club name should be created in club table";
  const updatedClubName = "updated name should be stored in club table";
  const failedClubName =
    "name should not be updated in club table upon invocation by confirmed user";

  cy.get(d("signUpTab")).click();
  cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
  cy.get(d("formAddClubClubName")).type(originalClubName);
  cy.get(d("formAddClubSubmit")).click();
  cy.contains("email sent!");
  verifyReceivedEmail(tempEmailAccount);
  envTask<{ userId: string; clubId: string }>("fetchNullableUser", {
    email: tempEmailAccount.user,
  }).then((user) => {
    if (!user) {
      throw new Error(`No user found for email ${tempEmailAccount.user}`);
    }
    envTask("fetchGroupsForUser", {
      userId: user.userId,
    }).then((groupNames) => {
      expect(groupNames).to.contain("adminClub");
    });
    envTask("expectUserDetails", {
      userId: user.userId,
      expectedUserDetails: {
        email: tempEmailAccount.user,
      },
    });
    envTask("expectClubName", {
      clubId: user.clubId,
      expectedClubName: originalClubName,
    });
    refreshSignupTab();
    cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
    cy.get(d("formAddClubClubName")).type(updatedClubName);
    cy.get(d("formAddClubSubmit")).click();
    cy.contains("email sent!");
    verifyReceivedEmail(tempEmailAccount);
    envTask("expectUserDetails", {
      userId: user.userId,
      expectedUserDetails: {
        email: tempEmailAccount.user,
      },
    });
    envTask("expectClubName", {
      clubId: user.clubId,
      expectedClubName: updatedClubName,
    });

    const newPassword = randomPassword();
    envTask("setNewPasswordViaAdmin", {
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
      envTask("receiveMessagesFromSqs", {
        queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
      }).should("be.empty");
    }
    envTask("expectUserDetails", {
      userId: user.userId,
      expectedUserDetails: {
        email: tempEmailAccount.user,
      },
    });
    envTask("expectClubName", {
      clubId: user.clubId,
      expectedClubName: updatedClubName, // NOT failedClubName
    });
  });
}

describe("submit button behavior on addClub form", () => {
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    cy.visit("http://localhost:3000");
    if (targetTestEnvDetailsFromEnv.stage === "prod") {
      cy.task<TempEmailAccount>("createTempEmailAccount").then(
        (tempEmailAccount: TempEmailAccount) => {
          envTask("cleanupUser", { email: tempEmailAccount.user });
          runAddClubHappyPath({ user: addrs.success });
        },
      );
    } else {
      envTask("purgeSqsQueue", {
        queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
      });
      envTask("cleanupUser", {
        email: addrs.success,
      });
      runAddClubHappyPath({ user: addrs.success });
    }
  });
});
