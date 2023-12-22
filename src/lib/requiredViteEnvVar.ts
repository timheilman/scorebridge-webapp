export default function requiredViteEnvVar(key: string): string {
  const trueKey = `VITE_${key}`;
  if (!import.meta.env[trueKey]) {
    throw new Error(
      `Please set ${trueKey} in env vars. (Did you export vars for your env to .env?)`,
    );
  }
  return import.meta.env[trueKey] as string;
}
