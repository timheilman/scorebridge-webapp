import { fullAddClubTest } from "../support/fullAddClubTest";

describe("submit button behavior on addClub form with API_KEY", () => {
  it("new address=>sends email; FORCE_RESET_PASSWORD address=>sends email; confirmed address=>already registered", () => {
    fullAddClubTest();
  });
});
