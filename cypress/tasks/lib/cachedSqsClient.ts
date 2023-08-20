import { SQSClient } from "@aws-sdk/client-sqs";

import { logFn } from "../../../src/lib/logging";
import fromSsoUsingProfile from "./fromSsoUsingProfile";
const log = logFn("cypress.tasks.lib.cachedSqsClient");

const dict: { [awsRegion: string]: { [profile: string]: SQSClient } } = {};

export function cachedSqsClient(awsRegion: string, profile: string) {
  if (dict[awsRegion] && dict[awsRegion][profile]) {
    return dict[awsRegion][profile];
  }
  if (!dict[awsRegion]) {
    dict[awsRegion] = {};
  }
  log("debug", `Profile ${profile}`);
  dict[awsRegion][profile] = new SQSClient({
    region: awsRegion,
    credentials: fromSsoUsingProfile(profile),
  });
  return dict[awsRegion][profile];
}
