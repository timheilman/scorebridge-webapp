export {};
// from https://docs.cypress.io/guides/end-to-end-testing/amazon-cognito-authentication
// cypress/support/authProviderCommands/cognito.ts
// Amazon Cognito
//
// const loginToCognito = (username: string, password: string) => {
//   Cypress.log({
//     displayName: "COGNITO LOGIN",
//     message: [`🔐 Authenticating | ${username}`],
//     autoEnd: false,
//   });
//
//   cy.visit("/");
//   cy.contains("Sign in with AWS", {
//     includeShadowDom: true,
//   }).click();
//
//   cy.origin(
//     Cypress.env("cognito_domain"),
//     {
//       args: {
//         username,
//         password,
//       },
//     },
//     ({ username, password }) => {
//       // Cognito log in page has some elements of the same id but are off screen.
//       // We only want the visible elements to log in
//       cy.get('input[name="username"]:visible').type(username);
//       cy.get('input[name="password"]:visible').type(password, {
//         // use log: false to prevent your password from showing in the Command Log
//         log: false,
//       });
//       cy.get('input[name="signInSubmitButton"]:visible').click();
//     },
//   );
//
//   // give a few seconds for redirect to settle
//   cy.wait(2000);
//
//   // verify we have made it passed the login screen
//   cy.contains("Get Started").should("be.visible");
// };
//
// // right now our custom command is light. More on this later!
//
// Cypress.Commands.add("loginByCognito", (username: string, password: string) => {
//   return loginToCognito(username, password);
// });

// use this way:
// describe('Cognito', function () {
//   beforeEach(function () {
//     // Seed database with test data
//     cy.task('db:seed')
//
//     // login via Amazon Cognito via cy.origin()
//     cy.loginByCognito(
//       Cypress.env('cognito_username'),
//       Cypress.env('cognito_password')
//     )
//   })
//
//   it('shows onboarding', function () {
//     cy.contains('Get Started').should('be.visible')
//   })
// })
