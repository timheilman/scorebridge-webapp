import { LogLevel } from "./genericLogger";
import { logFn } from "./logging";

export function getLogCompletionDecorator<T>(
  catPrefix: string,
  logLevel: LogLevel,
  ...addlArgs: unknown[]
) {
  return (promise: Promise<T>, catSuffix: string) =>
    logCompletionDecorator<T>(
      promise,
      catPrefix,
      catSuffix,
      logLevel,
      ...addlArgs,
    );
}

async function logCompletionDecorator<T>(
  promise: Promise<T>,
  catPrefix: string,
  catSuffix: string,
  logLevel: LogLevel,
  ...addlArgs: unknown[]
) {
  const r = await promise;
  logFn(catPrefix)(catSuffix, logLevel, ...addlArgs);
  return r;
}
