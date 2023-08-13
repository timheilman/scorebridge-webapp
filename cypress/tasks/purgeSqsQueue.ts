import {
  PurgeQueueCommand,
  PurgeQueueCommandOutput,
  PurgeQueueInProgress,
} from "@aws-sdk/client-sqs";

import { createSqsClient } from "./lib/createSqsClient";

export interface PurgeSqsQueueParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}
export const purgeSqsQueue = {
  async purgeSqsQueue({
    awsRegion,
    queueUrl,
    profile,
  }: PurgeSqsQueueParams): Promise<PurgeQueueCommandOutput> {
    const sqsClient = createSqsClient(awsRegion, profile);

    const purgeQueueParams = {
      QueueUrl: queueUrl,
    };

    const purgeQueueCommand = new PurgeQueueCommand(purgeQueueParams);

    try {
      return await sqsClient.send(purgeQueueCommand);
    } catch (e) {
      console.log("Message of the error");
      console.log(e);
      if (!(e instanceof PurgeQueueInProgress)) {
        throw e;
      }
      return { $metadata: {} };
    }
  },
};
