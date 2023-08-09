/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
describe("template spec", () => {
  it("passes", () => {
    cy.task("log", "Output me to the terminal");
    cy.visit("http://localhost:3000");
    cy.get("[data-test-id=signUpTab]").click();
    cy.get("[data-test-id=formAddClubEmailAddress]").type("fakeemail");
    expect(true).to.equal(true);
  });
});
