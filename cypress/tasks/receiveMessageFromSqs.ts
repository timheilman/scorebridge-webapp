import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { createSqsClient } from "./lib/createSqsClient";

export interface ReceiveMessageFromSqsParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}

const noSqsMessagesToFetch = "No messages received from the SQS queue.";
export const receiveMessageFromSqs = {
  async receiveMessagesExpectingNone({
    awsRegion,
    queueUrl,
    profile,
  }: ReceiveMessageFromSqsParams) {
    let latestEmail;
    try {
      latestEmail = await receiveMessageFromSqs.receiveMessageFromSqs({
        awsRegion,
        queueUrl,
        profile,
      });
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e?.message === noSqsMessagesToFetch) {
        return null;
      }
      throw e;
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Expected nothing to fetch but fetched ${latestEmail}`);
  },
  async receiveMessageFromSqs({
    queueUrl,
    awsRegion,
    profile,
  }: ReceiveMessageFromSqsParams): Promise<string> {
    const sqsClient = createSqsClient(awsRegion, profile);

    const receiveMessageParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 4,
    };

    const receiveMessageCommand = new ReceiveMessageCommand(
      receiveMessageParams,
    );

    const data = await sqsClient.send(receiveMessageCommand);
    console.log(`Found data: ${JSON.stringify(data, null, 2)}`);
    if (data.Messages && data.Messages.length > 0) {
      console.log(`Messages length: ${data.Messages.length}`);
      const messageBody = data.Messages.find((message) => {
        if (!message.Body) {
          return true;
        }
        if (
          message.Body ===
          "Successfully validated SNS topic for Amazon SES event publishing."
        ) {
          // this is a message involved in verification of the SES ConfigSet EventDestination
          // it only occurs once upon deployment of that EventDestination and can be disregarded
          return false;
        }
        return true;
      })?.Body;
      if (!messageBody) {
        throw new Error("Message found without message body");
      }
      console.log("Resolving message body");
      return messageBody;
    } else {
      throw new Error(noSqsMessagesToFetch);
    }
  },
};
