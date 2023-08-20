import {
  LoggingConfig,
  LogLevel,
  PrintFnParams,
  withConfigProvideLogFn,
} from "./genericLogger";
import loggingConfig from "./loggingConfig.json";
const getCloudPrintFn = (message: string, ...addlParams: unknown[]) => {
  return ({
    matchingConfigLine,
    requestedLogLevel,
    requestedKey,
  }: PrintFnParams) => {
    const remainingKey = requestedKey.slice(
      matchingConfigLine.keyPrefix.length,
    );
    console.log(
      `${new Date().toJSON()} ${requestedLogLevel.toLocaleUpperCase()} (${
        matchingConfigLine.keyPrefix
      }@${matchingConfigLine.logLevel.toLocaleUpperCase()})${remainingKey} ${message}`,
      ...addlParams,
    );
  };
};
console.log(
  `Found filesystem logging config:\n${JSON.stringify(loggingConfig)}`,
);
export function logFn(
  key: string,
): (logLevel: LogLevel, message: string, ...addlParams: unknown[]) => void {
  return withConfigProvideLogFn(
    loggingConfig as LoggingConfig,
    getCloudPrintFn,
  )(key);
}
