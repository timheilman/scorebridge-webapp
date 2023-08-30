import requiredEnvVar from "./requiredEnvVar";
export const targetTestEnvDetailsFromEnv = {
  profile: requiredEnvVar("SB_TEST_AWS_CLI_PROFILE"),
  awsRegion: requiredEnvVar("AWS_REGION"),
  poolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
  userTableName: requiredEnvVar("USERS_TABLE"),
  clubTableName: requiredEnvVar("CLUBS_TABLE"),
  clubDevicesTableName: requiredEnvVar("CLUB_DEVICES_TABLE"),
  sesSandboxSqsQueueUrl: requiredEnvVar("SES_SANDBOX_SQS_QUEUE_URL"),
  stage: requiredEnvVar("STAGE"),
  userPoolClientIdWeb: requiredEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"),
};
