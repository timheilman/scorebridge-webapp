import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { createSqsClient } from "./lib/createSqsClient";

export interface ReceiveMessagesFromSqsParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}

async function deleteMessage(
  queueUrl: string,
  message: { ReceiptHandle?: string | undefined },
  sqsClient: SQSClient,
) {
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    }),
  );
}

export const receiveMessagesFromSqs = {
  async receiveMessagesFromSqs({
    queueUrl,
    awsRegion,
    profile,
  }: ReceiveMessagesFromSqsParams): Promise<(string | null)[]> {
    const sqsClient = createSqsClient(awsRegion, profile);

    const receiveMessageParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 9,
    };

    const receiveMessageCommand = new ReceiveMessageCommand(
      receiveMessageParams,
    );

    const data = await sqsClient.send(receiveMessageCommand);
    console.log(`Found data: ${JSON.stringify(data, null, 2)}`);
    const promises: Promise<unknown>[] = [];
    if (!data.Messages) {
      return [];
    }
    // On initial deploy there's a validation message; it does not get repeated but we must discard it
    const valMsgPred = (msg: any) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      msg.Body ===
      "Successfully validated SNS topic for Amazon SES event publishing.";
    const validationMessage = data.Messages.find(valMsgPred);
    if (validationMessage) {
      promises.push(deleteMessage(queueUrl, validationMessage, sqsClient));
    }
    const messageBodies = data.Messages.filter((m) => !valMsgPred(m)).map(
      (message) => {
        const messageBody = message.Body;
        if (!messageBody) {
          return null;
        }
        promises.push(deleteMessage(queueUrl, message, sqsClient));
        return messageBody;
      },
    );
    await Promise.all(promises);
    return messageBodies;
  },
};
