import {
  LoggingConfig,
  LogLevel,
  PrintFnParams,
  withConfigProvideLogFn,
} from "./genericLogger";
import fileLoggingConfig from "./loggingConfig.json";
const getCloudPrintFn = (message: string, ...addlParams: unknown[]) => {
  return ({
    matchingConfigCat,
    matchingConfigLevel,
    requestedLevel,
    requestedCat,
  }: PrintFnParams) => {
    const remainingKey = requestedCat.slice(matchingConfigCat.length);
    console.log(
      `${new Date().toJSON()} ${requestedLevel.toLocaleUpperCase()} (${matchingConfigCat}@${matchingConfigLevel.toLocaleUpperCase()})${remainingKey} ${message}`,
      ...addlParams,
    );
  };
};
console.log(
  `Loaded-for-default filesystem logging config:\n${JSON.stringify(
    fileLoggingConfig,
  )}`,
);

function currentConfig() {
  const envConfigStr = process.env["REACT_APP_SB_LOGGING_CONFIG"];
  if (envConfigStr) {
    let envConfigObj;
    try {
      envConfigObj = JSON.parse(envConfigStr) as LoggingConfig;
    } catch (e) {
      console.error(
        "Unable to parse logging config from env var, falling back to file.",
      );
      return fileLoggingConfig as LoggingConfig;
    }
    return envConfigObj;
  }
  return fileLoggingConfig as LoggingConfig;
}

export function logFn(
  key: string,
): (logLevel: LogLevel, message: string, ...addlParams: unknown[]) => void {
  return withConfigProvideLogFn(currentConfig(), getCloudPrintFn)(key);
}
