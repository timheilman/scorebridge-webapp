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

function genericLogger(loggingConfig: LoggingConfig) {
  return (
    category: string,
    logLevel: LogLevel,
    printFn: (p: PrintFnParams) => void,
  ) => {
    const matchingConfigCat = Object.keys(loggingConfig).reduce<string | null>(
      (acc, configKey) => {
        if (category.startsWith(configKey)) {
          if (!acc || acc.length <= configKey.length) {
            return configKey;
          }
        }
        return acc;
      },
      null,
    );
    if (
      matchingConfigCat !== null && // default is OFF
      levelToInt[logLevel] >= levelToInt[loggingConfig[matchingConfigCat]]
    ) {
      printFn({
        matchingConfigLevel: loggingConfig[matchingConfigCat],
        matchingConfigCat: matchingConfigCat,
        requestedLevel: logLevel,
        requestedCat: category,
      });
    }
  };
}

export function withConfigProvideLogFn(
  config: LoggingConfig,
  printFnProvider: (...addlParams: unknown[]) => (p: PrintFnParams) => void,
) {
  return (catPrefix: string) => {
    return (
      catSuffix: string,
      logLevel: LogLevel,
      ...addlParams: unknown[]
    ) => {
      genericLogger(config)(
        catPrefix + catSuffix,
        logLevel,
        printFnProvider(...addlParams),
      );
    };
  };
}

import fileLoggingConfig from "./loggingConfig.json";
export const getPrintFn = (...addlParams: unknown[]) => {
  return ({
    matchingConfigCat,
    matchingConfigLevel,
    requestedLevel,
    requestedCat,
  }: PrintFnParams) => {
    const remainingKey = requestedCat.slice(matchingConfigCat.length);
    console.log(
      `${new Date().toJSON()} ${requestedLevel.toLocaleUpperCase()} (${matchingConfigCat}@${matchingConfigLevel.toLocaleUpperCase()})${remainingKey}`,
      ...addlParams,
    );
  };
};
console.log(
  `Loaded-for-default filesystem logging config:\n${JSON.stringify(
    fileLoggingConfig,
  )}`,
);

export function currentConfig(envConfigStr: string | undefined) {
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
