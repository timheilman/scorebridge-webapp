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

function verifyBackendDetails(
  user: { userId: string; clubId: string },
  tempEmailAccount:
    | TempEmailAccount
    | {
        user: string;
      },
  originalClubName: string,
) {
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
}

function fillForm(
  tempEmailAccount: TempEmailAccount | { user: string },
  clubName: string,
) {
  cy.get(d("formAddClubEmailAddress")).type(tempEmailAccount.user);
  cy.get(d("formAddClubClubName")).type(clubName);
  cy.get(d("formAddClubSubmit")).click();
}

export function runAddClubHappyPath(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  const clubName = "Ace of Clubs";
  cy.get(d("superChickenModeTab")).click();
  fillForm(tempEmailAccount, clubName);
  cy.contains("email sent!");
  verifyReceivedEmail(tempEmailAccount);
  envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
    email: tempEmailAccount.user,
  }).then((user) => {
    verifyBackendDetails(user, tempEmailAccount, clubName);
  });
}

export function runAddClubSadPath(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  const clubName = "Ace of Clubs";
  cy.get(d("superChickenModeTab")).click();
  fillForm(tempEmailAccount, clubName);
  cy.contains("Not Authorized to access addClub on type Mutation");
}
export function runAddClubHappyPathFull(
  tempEmailAccount: TempEmailAccount | { user: string },
) {
  const originalClubName = "original club name should be created in club table";
  const updatedClubName = "updated name should be stored in club table";
  const failedClubName =
    "name should not be updated in club table upon invocation by confirmed user";

  cy.get(d("signUpTab")).click();
  fillForm(tempEmailAccount, originalClubName);
  cy.contains("email sent!");
  verifyReceivedEmail(tempEmailAccount);
  envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
    email: tempEmailAccount.user,
  }).then((user) => {
    verifyBackendDetails(user, tempEmailAccount, originalClubName);
    refreshSignupTab();
    fillForm(tempEmailAccount, updatedClubName);
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
    fillForm(tempEmailAccount, failedClubName);
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

export function withTestAccount(
  doThis: (tempAcct: TempEmailAccount | { user: string }) => void,
) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    cy.task<TempEmailAccount>("createTempEmailAccount").then(
      (tempEmailAccount: TempEmailAccount) => {
        envTask("cleanupUser", { email: tempEmailAccount.user });
        doThis(tempEmailAccount);
      },
    );
  } else {
    envTask("purgeSqsQueue", {
      queueUrl: targetTestEnvDetailsFromEnv.sesSandboxSqsQueueUrl,
    });
    envTask("cleanupUser", {
      email: addrs.success,
    });
    doThis({ user: addrs.success });
  }
}
