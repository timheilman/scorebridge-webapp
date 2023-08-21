// We want to be able to log from anyfile like this:
// log("DEBUG", "message")

// but to help locate which file is doing the logging, we want per-file:
// const log = logFn("src.features.signIn.ScoreBridgeAuthenticator")
// to then use in the above message

// But we want to configure only once:
// 1) the config
// 2) how to format the resulting message
// 3) where to send it (like console.log or a file)

// so at the per-repo-level, bare bones example:
// const config = JSON.parse(
//   readRelativeUtf8FileSync("config.json"),
// ) as LoggingConfig;
// const getPrintFn = (message) => {
//   return ({ requestedCat, requestedLevel }: PrintFnParams) => {
//     console.log(
//       `${new Date().toJSON()} ${requestedCat} ${requestedLevel} ${message}`,
//     );
//   };
// };
// export const logFn = withConfigProvideLogFn(config, getPrintFn);
// in order to provide the const log = logFn(), call above

const levelToInt = {
  trace: 100,
  debug: 200,
  info: 300,
  warn: 400,
  error: 500,
  fatal: 600,
};
export type LogLevel = keyof typeof levelToInt;
export type LoggingConfig = {
  [keyPrefix: string]: LogLevel;
};

export interface PrintFnParams {
  matchingConfigCat: string;
  matchingConfigLevel: string;
  requestedLevel: LogLevel;
  requestedCat: string;
}

export function genericLogger(loggingConfig: LoggingConfig) {
  return (
    key: string,
    logLevel: LogLevel,
    printFn: (p: PrintFnParams) => void,
  ) => {
    const matchingConfigCat = Object.keys(loggingConfig).reduce<string | null>(
      (acc, configKey) => {
        if (key.startsWith(configKey)) {
          if (!acc || acc.length <= configKey.length) {
            return configKey;
          }
        }
        return acc;
      },
      null,
    );
    if (
      matchingConfigCat && // default is OFF
      levelToInt[logLevel] >= levelToInt[loggingConfig[matchingConfigCat]]
    ) {
      printFn({
        matchingConfigLevel: loggingConfig[matchingConfigCat],
        matchingConfigCat: matchingConfigCat,
        requestedLevel: logLevel,
        requestedCat: key,
      });
    }
  };
}

export function withConfigProvideLogFn(
  config: LoggingConfig,
  printFnProvider: (
    message: string,
    ...addlParams: unknown[]
  ) => (p: PrintFnParams) => void,
) {
  return (key: string) => {
    return (logLevel: LogLevel, message: string, ...addlParams: unknown[]) => {
      genericLogger(config)(
        key,
        logLevel,
        printFnProvider(message, ...addlParams),
      );
    };
  };
}
