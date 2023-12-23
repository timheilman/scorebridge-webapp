import { LogLevel } from "../../src/scorebridge-ts-submodule/genericLogger";
import { cypressTaskLogFn } from "../support/cypressTaskLogFn";

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
  const log = cypressTaskLogFn(catPrefix);
  log(catSuffix, logLevel, ...addlParams);

  return null;
};
