// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
describe("load of special on-purpose unexpected error page", () => {
  it("identifies the error type and displays its message", () => {
    cy.visit("http://localhost:3000/unexpected_error");
    cy.contains(
      "This error is a synthetic unexpected error from a lambda implementation.",
    );
    cy.contains('"errorType": "UnexpectedError"');
  });
});
