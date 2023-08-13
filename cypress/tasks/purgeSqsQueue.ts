import {
  PurgeQueueCommand,
  PurgeQueueCommandOutput,
  PurgeQueueInProgress,
} from "@aws-sdk/client-sqs";

import { cachedSqsClient } from "./lib/cachedSqsClient";

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
    const purgeQueueCommand = new PurgeQueueCommand({
      QueueUrl: queueUrl,
    });

    try {
      return await cachedSqsClient(awsRegion, profile).send(purgeQueueCommand);
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
