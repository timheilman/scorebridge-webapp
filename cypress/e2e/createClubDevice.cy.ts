import { withPreexistingCredsDo } from "../support/authUtils";
import { dataTestIdSelector as d } from "../support/dataTestIdSelector";
import { envTask } from "../support/envTask";
import requiredCypressEnvVar from "../support/requiredCypressEnvVar";

const stage = requiredCypressEnvVar("STAGE");

describe("signUp", () => {
  it("with adminClub-club00, passes happy path", () => {
    const userEmail = `scorebridge8+${stage}-testUser-adminClub-club00@gmail.com`;
    const deviceEmail = `scorebridge8+${stage}-clubDevice-TEST5678@gmail.com`;
    envTask("cleanupClubDevice", { email: deviceEmail });
    withPreexistingCredsDo(stage, userEmail, () => {
      cy.get(d("formCreateClubDeviceDeviceName")).type(
        "adminClub-club00-device-01",
      );
      cy.get(d("formCreateClubDeviceRegToken")).type("TEST567890123456");
      // invoke the mutation:
      cy.get(d("formCreateClubDeviceSubmit")).click();
      // verify the subscription:
      cy.get(d("clubDevicesPageTable")).contains("adminClub-club00-device-01");
      // verify the mutation (without this, previous verify may have been of pre-existing cruft):
      cy.contains(
        /device adminClub-club00-device-01: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} created/,
      );
    });
  });
});
