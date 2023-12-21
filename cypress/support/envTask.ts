import { targetTestEnvDetailsFromEnv } from "./targetTestEnvDetailsFromEnv";

export function envTask<T>(
  taskName: string,
  addlProps: Record<string, unknown>,
): Cypress.Chainable<T> {
  return cy.task<T>(taskName, { ...targetTestEnvDetailsFromEnv, ...addlProps });
}
