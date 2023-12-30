import {
  currentConfig,
  getPrintFn,
  LogLevel,
  withConfigProvideLogFn,
} from "../scorebridge-ts-submodule/genericLogger";

export function logFn(
  catPrefix: string,
): (catSuffix: string, logLevel: LogLevel, ...addlParams: unknown[]) => void {
  const envConfigStr = import.meta.env.VITE_SB_LOGGING_CONFIG as
    | string
    | undefined;
  return withConfigProvideLogFn(
    currentConfig(envConfigStr),
    getPrintFn,
  )(catPrefix);
}
