export default function requiredEnvVar(key: string): string {
  if (!Cypress.env(key)) {
    throw new Error(`Please set ${key} in env vars.`);
  }
  return (Cypress.env(key) as string) || "NOT_FOUND";
}
