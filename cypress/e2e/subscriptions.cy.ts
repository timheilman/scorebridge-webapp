import { withPreexistingCredsDo } from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import requiredCypressEnvVar from "../support/requiredCypressEnvVar";

const stage = requiredCypressEnvVar("STAGE");

function withClub00CheckSubscriptions(
  user: { userId: string; clubId: string },
  expectedMessage: string,
  specifyClubId = true,
) {
  cy.visit("http://localhost:5173/super_chicken_mode");
  if (specifyClubId) {
    cy.get(d("inputFallbackClubId")).type(user.clubId);
    cy.get(d("buttonSubmitFallbackClubId")).click();
  }
  cy.contains(
    new RegExp(
      `Subscription: onCreateClubDevice; status: .*${expectedMessage}.*; clubId: ${user.clubId}`,
    ),
  );
  cy.contains(
    new RegExp(
      `Subscription: onDeleteClubDevice; status: .*${expectedMessage}.*; clubId: ${user.clubId}`,
    ),
  );
  cy.contains(
    new RegExp(
      `Subscription: onUpdateClub; status: .*${expectedMessage}.*; clubId: ${user.clubId}`,
    ),
  );
}

describe("subscriptions", () => {
  beforeEach(() => {
    envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
      email: `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`,
    }).as("club00User");
    envTask("logoutByCognitoApi", {});
  });

  it("with API_KEY, no subscriptions allowed", () => {
    cy.get<{ userId: string; clubId: string }>("@club00User").then((user) => {
      withClub00CheckSubscriptions(
        user,
        "Not Authorized to access .* on type Subscription",
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
          withClub00CheckSubscriptions(user, "successfullySubscribed", false);
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
          withClub00CheckSubscriptions(user, "401: Invalid Club Id");
        },
      );
    });
  });
});
