import {
    randomPassword,
    setNewPassword,
    submitCreateClubDetails,
    withPreexistingCredsDo,
    withTestAccount,
    withUnverifiedTempClubAdminDo,
} from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { verifyReceivedEmail } from "../support/emailUtils";
import { envTask } from "../support/envTask";
import { refreshSignupTab } from "../support/refreshSignupTab";
import requiredEnvVar from "../support/requiredEnvVar";
import { targetTestEnvDetailsFromEnv } from "../support/targetTestEnvDetailsFromEnv";
import { expectBackendDetails, expectDdbDetails } from "../support/userUtils";

const stage = requiredEnvVar("STAGE");

describe("subscriptions", () => {
    it("with API_KEY, no subscriptions allowed", () => {
        cy.visit("http://localhost:3000/super_chicken_mode");
        cy.get(d(''))
    }

    it("with adminSuper, passes happy path", () => {
        const email = `scorebridge8+${stage}-testUser-adminSuper@gmail.com`;
        withPreexistingCredsDo(stage, email, () => {
            withTestAccount((tempAcct) => {
                cy.visit("http://localhost:3000/super_chicken_mode");
                const clubName = "Ace of Clubs";
                submitCreateClubDetails(tempAcct.user, clubName);
                cy.contains("email sent!");
                verifyReceivedEmail(tempAcct);
                envTask<{ userId: string; clubId: string }>("fetchNullableCogUser", {
                    email: tempAcct.user,
                }).then((user) => {
                    expectBackendDetails(user, tempAcct, clubName);
                });
            });
        });
    });
});
