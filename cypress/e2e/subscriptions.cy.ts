import { withPreexistingCredsDo } from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import requiredEnvVar from "../support/requiredEnvVar";

const stage = requiredEnvVar("STAGE");

function withClub00CheckSubscriptions(
  user: { userId: string; clubId: string },
  expectedMessage: string,
  specifyClubId = true,
) {
  cy.visit("http://localhost:3000/super_chicken_mode");
  if (specifyClubId) {
    cy.get(d("inputFallbackClubId")).type(user.clubId);
  }
  cy.contains("reinitializing subscriptions...");
  cy.contains(
    new RegExp(
      `Subscription: createdClubDevice; status: .*${expectedMessage}.*; clubId: ${user.clubId}`,
    ),
  );
}

describe("subscriptions", () => {
  beforeEach(() => {
    envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
      email: `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`,
    }).as("club00User");
  });
  it("with API_KEY, no subscriptions allowed", () => {
    cy.get<{ userId: string; clubId: string }>("@club00User").then((user) => {
      withClub00CheckSubscriptions(
        user,
        "Not Authorized to access deletedClubDevice on type Subscription",
      );
    });
  });
  it("with adminSuper, subscriptions allowed", () => {
    cy.get<{ userId: string; clubId: string }>("@club00User").then((user) => {
      withPreexistingCredsDo(
        stage,
        `scorebridge8+${stage}-testUser-adminSuper@gmail.com`,
        () => {
          withClub00CheckSubscriptions(user, "successfullySubscribed");
        },
      );
    });
  });
  it("with own clubId, subscriptions allowed", () => {
    cy.get<{ userId: string; clubId: string }>("@club00User").then((user) => {
      withPreexistingCredsDo(
        stage,
        `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`,
        () => {
          withClub00CheckSubscriptions(user, "successfullySubscribed");
        },
      );
    });
  });
  it("with other clubId, subscriptions not allowed", () => {
    cy.get<{ userId: string; clubId: string }>("@club00User").then((user) => {
      withPreexistingCredsDo(
        stage,
        `scorebridge8+${stage}-testUser-adminClub-club01@gmail.com`,
        () => {
          withClub00CheckSubscriptions(
            user,
            "Can only subscribe to clubDevice creations from one's own club.",
          );
        },
      );
    });
  });
});
