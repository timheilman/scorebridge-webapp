import { config as dotenvConfig } from "dotenv";

import {
  currentConfig,
  getPrintFn,
  LogLevel,
  withConfigProvideLogFn,
} from "../../src/scorebridge-ts-submodule/genericLogger";
dotenvConfig();
export function cypressTaskLogFn(
  catPrefix: string,
): (catSuffix: string, logLevel: LogLevel, ...addlParams: unknown[]) => void {
  return withConfigProvideLogFn(
    currentConfig(process.env.SB_LOGGING_CONFIG),
    getPrintFn,
  )(catPrefix);
}
