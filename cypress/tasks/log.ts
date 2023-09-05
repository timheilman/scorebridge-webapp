import { LogLevel } from "../../src/scorebridge-ts-submodule/genericLogger";
import { logFn } from "../../src/lib/logging";

export interface LogParams {
  catPrefix: string;
  catSuffix: string;
  logLevel: LogLevel;
  addlParams: unknown[];
}

export const log = ({
  catPrefix,
  catSuffix,
  logLevel,
  addlParams,
}: LogParams) => {
  const log = logFn(catPrefix);
  log(catSuffix, logLevel, ...addlParams);

  return null;
};
