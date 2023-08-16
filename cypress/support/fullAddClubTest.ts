/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import chance from "chance";

import { addrs } from "../support/awsSesSandbox";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import { refreshSignupTab } from "../support/refreshSignupTab";
import requiredEnvVar from "../support/requiredEnvVar";
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

function verifyReceivedEmailProd(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.task("fetchLatestEmail", tempEmailAccount).then((latestEmail) => {
    expect(latestEmail).to.include(`Welcome to the ScoreBridge Admin Portal`);
    expect(latestEmail).to.include(
      `You are receiving this email because your address was submitted for registration with this portal.`,
    );
    expect(latestEmail).to.include(`Username: ${tempEmailAccount.user}`);
    expect(latestEmail).to.include(/Password: [^ ]{8}/);
    expect(latestEmail).to.include(
      `<a href="${requiredEnvVar("PORTAL_URL")}">${requiredEnvVar(
        "PORTAL_URL",
      )}</a>`,
    );
  });
}
interface VerifyReceivedEmailNonProdParams {
  user: string;
}
function verifyReceivedEmailNonProd({
  user,
}: VerifyReceivedEmailNonProdParams) {
  envTask<string[]>("receiveMessagesFromSqs", {
    queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
  }).then((unparsedSqses: string[]) => {
    expect(unparsedSqses.length).to.equal(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedMessage = JSON.parse(
      JSON.parse(unparsedSqses[0]).Message as string,
    );
    expect(parsedMessage.eventType).to.match(/^Delivery$/);
    // cy.task("log", JSON.stringify(parsedMessage, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ch = parsedMessage.mail.commonHeaders;
    expect(ch.from.length).to.equal(1);
    expect(ch.from[0]).to.equal(
      `ScoreBridge Admin Portal <scorebridge8+${requiredEnvVar(
        "STAGE",
      )}@gmail.com>`,
    );
    expect(ch.replyTo.length).to.equal(1);
    expect(ch.replyTo[0]).to.equal(
      `scorebridge8+${requiredEnvVar("STAGE")}-do-not-reply@gmail.com`,
    );
    expect(ch.to.length).to.equal(1);
    expect(ch.to[0]).to.equal(user);
    expect(ch.subject).to.equal(
      `Welcome to the ScoreBridge-${requiredEnvVar("STAGE")} App`,
    );
  });
}

function verifyReceivedEmail(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    verifyReceivedEmailProd(tempEmailAccount);
  } else {
    verifyReceivedEmailNonProd(tempEmailAccount);
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
  envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
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
    envTask("expectDdbUserDetails", {
      userId: user.userId,
      expectedUserDetails: {
        email: tempEmailAccount.user,
      },
    });
    envTask("expectClubDetails", {
      clubId: user.clubId,
      expectedClubDetails: { name: originalClubName },
    });
    refreshSignupTab();
    cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
    cy.get(d("formAddClubClubName")).type(updatedClubName);
    cy.get(d("formAddClubSubmit")).click();
    cy.contains("email sent!");
    verifyReceivedEmail(tempEmailAccount);
    envTask("expectDdbUserDetails", {
      userId: user.userId,
      expectedUserDetails: { email: tempEmailAccount.user },
    });
    envTask("expectClubDetails", {
      clubId: user.clubId,
      expectedClubDetails: { name: updatedClubName },
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
    envTask("expectDdbUserDetails", {
      userId: user.userId,
      expectedUserDetails: {
        email: tempEmailAccount.user,
      },
    });
    envTask("expectClubDetails", {
      clubId: user.clubId,
      expectedClubDetails: { name: updatedClubName }, // NOT failedClubName
    });
  });
}

export function fullAddClubTest() {
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
}
