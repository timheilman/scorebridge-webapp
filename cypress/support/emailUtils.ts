import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import { envTask } from "./envTask";
import requiredCypressEnvVar from "./requiredCypressEnvVar";
import { targetTestEnvDetailsFromEnv } from "./targetTestEnvDetailsFromEnv";

/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
function verifyReceivedEmailProd(tempAcct: TempEmailAccount) {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.task<string>("fetchLatestEmail", tempAcct).then((latestEmail: string) => {
    expect(latestEmail).to.match(`Welcome to the ScoreBridge Admin Portal`);
    expect(latestEmail).to.match(
      `You are receiving this email because your address was submitted for registration with this portal.`,
    );
    expect(latestEmail).to.match(`Username: ${tempAcct.user}`);
    expect(latestEmail).to.match(/Password: [^ ]{8}/);
    expect(latestEmail).to.match(
      `<a href="${requiredCypressEnvVar("PORTAL_URL")}">${requiredCypressEnvVar(
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
    // cy.task("log", { catPrefix: "cypress.support.fullCreateClubTest", catSuffix: "verifyReceivedEmailNonProd", logLevel: "error", addlParams: [parsedMessage]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ch = parsedMessage.mail.commonHeaders;
    expect(ch.from.length).to.equal(1);
    expect(ch.from[0]).to.equal(
      `ScoreBridge Admin Portal <scorebridge8+${requiredCypressEnvVar(
        "STAGE",
      )}@gmail.com>`,
    );
    expect(ch.replyTo.length).to.equal(1);
    expect(ch.replyTo[0]).to.equal(
      `scorebridge8+${requiredCypressEnvVar("STAGE")}-do-not-reply@gmail.com`,
    );
    expect(ch.to.length).to.equal(1);
    expect(ch.to[0]).to.equal(user);
    expect(ch.subject).to.equal(
      `Welcome to the ScoreBridge-${requiredCypressEnvVar("STAGE")} App`,
    );
  });
}
/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

export function verifyReceivedEmail(tempAcct: TempEmailAccount) {
  if (targetTestEnvDetailsFromEnv.stage === "prod") {
    verifyReceivedEmailProd(tempAcct);
  } else {
    verifyReceivedEmailNonProd(tempAcct);
  }
}
