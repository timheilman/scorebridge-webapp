import { withPreexistingCredsDo } from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import requiredEnvVar from "../support/requiredEnvVar";

const stage = requiredEnvVar("STAGE");

function withClub00CheckSubscriptions(
  expectedMessage: string,
  specifyClubId = true,
) {
  cy.visit("http://localhost:3000/super_chicken_mode");
  envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
    email: `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`,
  }).then((user) => {
    if (specifyClubId) {
      cy.get(d("inputFallbackClubId")).type(user.clubId);
    }
    cy.contains("reinitializing subscriptions...");
    cy.contains(
      `Status of subscription createdClubDevice is ${expectedMessage}`,
    );
    cy.contains(
      `Status of subscription deletedClubDevice is ${expectedMessage}`,
    );
  });
}

describe("subscriptions", () => {
  it("with API_KEY, no subscriptions allowed", () => {
    withClub00CheckSubscriptions("failed");
  });
  it("with adminSuper, subscriptions allowed", () => {
    withPreexistingCredsDo(
      stage,
      `scorebridge8+${stage}-testUser-adminSuper@gmail.com`,
      () => {
        withClub00CheckSubscriptions("successfullySubscribed");
      },
    );
  });
  it("with own clubId, subscriptions allowed", () => {
    withPreexistingCredsDo(
      stage,
      `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`,
      () => {
        withClub00CheckSubscriptions("successfullySubscribed", false);
      },
    );
  });
  it("with other clubId, subscriptions not allowed", () => {
    withPreexistingCredsDo(
      stage,
      `scorebridge8+${stage}-testUser-adminClub-club01@gmail.com`,
      () => {
        withClub00CheckSubscriptions("failed");
      },
    );
  });
});
