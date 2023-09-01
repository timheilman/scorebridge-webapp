import requiredCypressEnvVar from "./requiredCypressEnvVar";
export const targetTestEnvDetailsFromEnv = {
  profile: requiredCypressEnvVar("SB_TEST_AWS_CLI_PROFILE"),
  awsRegion: requiredCypressEnvVar("AWS_REGION"),
  poolId: requiredCypressEnvVar("COGNITO_USER_POOL_ID"),
  userTableName: requiredCypressEnvVar("USERS_TABLE"),
  clubTableName: requiredCypressEnvVar("CLUBS_TABLE"),
  clubDevicesTableName: requiredCypressEnvVar("CLUB_DEVICES_TABLE"),
  sesSandboxSqsQueueUrl: requiredCypressEnvVar("SES_SANDBOX_SQS_QUEUE_URL"),
  stage: requiredCypressEnvVar("STAGE"),
  userPoolClientIdWeb: requiredCypressEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"),
};
