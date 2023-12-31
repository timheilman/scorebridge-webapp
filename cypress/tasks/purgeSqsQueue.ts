import {
  PurgeQueueCommand,
  PurgeQueueCommandOutput,
  PurgeQueueInProgress,
} from "@aws-sdk/client-sqs";

import { logFn } from "../../src/lib/logging";
import { cachedSqsClient } from "../../src/scorebridge-ts-submodule/cachedSqsClient";
const log = logFn("cypress.tasks.purgeSqsQueue.");

export interface PurgeSqsQueueParams {
  awsRegion: string;
  queueUrl: string;
  profile: string;
}
export const purgeSqsQueue = async ({
  awsRegion,
  queueUrl,
  profile,
}: PurgeSqsQueueParams): Promise<PurgeQueueCommandOutput> => {
  const purgeQueueCommand = new PurgeQueueCommand({
    QueueUrl: queueUrl,
  });

  try {
    return await cachedSqsClient(awsRegion, profile).send(purgeQueueCommand);
  } catch (e) {
    log("purgeSqsQueue.error", "error", e);
    if (!(e instanceof PurgeQueueInProgress)) {
      throw e;
    }
    return { $metadata: {} };
  }
};
