// cypress/support/auth-provider-commands/cognito.ts

import { Amplify /*, Auth*/ } from "aws-amplify";

import requiredEnvVar from "../../support/requiredEnvVar";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Amplify.configure({
  Auth: {
    region: requiredEnvVar("AWS_REGION"),
    userPoolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
    userPoolWebClientId: requiredEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"), // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  },
});

// Amazon Cognito
Cypress.Commands.add(
  "loginByCognitoApi",
  (username: string, password: string) => {
    const log = Cypress.log({
      displayName: "COGNITO LOGIN",
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });

    log.snapshot("before");

    // const signIn = Auth.signIn({ username, password });
    //
    // cy.wrap(signIn, { log: false }).then((cognitoResponse) => {
    //   const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;
    //
    //   window.localStorage.setItem(
    //     `${keyPrefixWithUsername}.idToken`,
    //     cognitoResponse.signInUserSession.idToken.jwtToken,
    //   );
    //
    //   window.localStorage.setItem(
    //     `${keyPrefixWithUsername}.accessToken`,
    //     cognitoResponse.signInUserSession.accessToken.jwtToken,
    //   );
    //
    //   window.localStorage.setItem(
    //     `${keyPrefixWithUsername}.refreshToken`,
    //     cognitoResponse.signInUserSession.refreshToken.token,
    //   );
    //
    //   window.localStorage.setItem(
    //     `${keyPrefixWithUsername}.clockDrift`,
    //     cognitoResponse.signInUserSession.clockDrift,
    //   );
    //
    //   window.localStorage.setItem(
    //     `${cognitoResponse.keyPrefix}.LastAuthUser`,
    //     cognitoResponse.username,
    //   );
    //
    //   window.localStorage.setItem(
    //     "amplify-authenticator-authState",
    //     "signedIn",
    //   );
    //   log.snapshot("after");
    //   log.end();
    // });

    cy.visit("http://localhost:3000/");
  },
);
