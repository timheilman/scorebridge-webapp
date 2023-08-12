import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { createSqsClient } from "./lib/createSqsClient";

export interface ReceiveMessageFromSqsParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}
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
      if (e?.message === "Nothing to fetch") {
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

    return new Promise<string>((resolve, reject) => {
      sqsClient
        .send(receiveMessageCommand)
        .then((data) => {
          console.log(`Found data: ${JSON.stringify(data, null, 2)}`);
          if (data.Messages && data.Messages.length > 0) {
            console.log(`Messages length: ${data.Messages.length}`);
            const message = data.Messages[0];
            if (!message.Body) {
              reject(new Error("No message body"));
              return;
            }
            console.log("Resolving message body");
            resolve(message.Body);
          } else {
            reject(new Error("No messages received from the SQS queue."));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
