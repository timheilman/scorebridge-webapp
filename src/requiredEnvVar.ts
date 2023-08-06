export default function requiredEnvVar(key: string): string {
  const trueKey = `REACT_APP_${key}`;
  if (!process.env[trueKey]) {
    throw new Error(`Please set ${trueKey} in env vars.`);
  }
  return process.env[trueKey] as string;
}
