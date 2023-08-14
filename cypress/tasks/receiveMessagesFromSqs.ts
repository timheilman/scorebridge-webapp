import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";

import { cachedSqsClient } from "./lib/cachedSqsClient";

export interface ReceiveMessagesFromSqsParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}

interface DeleteMessageParams {
  queueUrl: string;
  message: { ReceiptHandle?: string | undefined };
  awsRegion: string;
  profile: string;
}

async function deleteMessage({
  queueUrl,
  message,
  awsRegion,
  profile,
}: DeleteMessageParams) {
  await cachedSqsClient(awsRegion, profile).send(
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
    const data = await cachedSqsClient(awsRegion, profile).send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 9,
      }),
    );
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
      promises.push(
        deleteMessage({
          queueUrl,
          message: validationMessage,
          awsRegion,
          profile,
        }),
      );
    }
    const messageBodies = data.Messages.filter((m) => !valMsgPred(m)).map(
      (message) => {
        const messageBody = message.Body;
        if (!messageBody) {
          return null;
        }
        promises.push(deleteMessage({ queueUrl, message, awsRegion, profile }));
        return messageBody;
      },
    );
    await Promise.all(promises);
    return messageBodies;
  },
};
