// cypress/support/auth-provider-commands/cognito.ts

import { Amplify, Auth } from "aws-amplify";

import requiredEnvVar from "../../support/requiredEnvVar";

Amplify.configure({
  Auth: {
    region: requiredEnvVar("AWS_REGION"),
    userPoolId: requiredEnvVar("COGNITO_USER_POOL_ID"),
    userPoolWebClientId: requiredEnvVar("COGNITO_USER_POOL_CLIENT_ID_WEB"), // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  },
});

// Amazon Cognito
Cypress.Commands.add(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "loginByCognitoApi",
  (username: string, password: string) => {
    const log = Cypress.log({
      displayName: "COGNITO LOGIN",
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });

    log.snapshot("before");

    const signIn = Auth.signIn({ username, password });

    cy.wrap(signIn, { log: false }).then((cognitoResponse) => {
      // The following is some voodoo found on webpages from before TypeScript
      // also, it seems as though this was all before Cognito got a good API
      // in place, and just slurps from internals.  It's ugly but it works.
      /* eslint-disable @typescript-eslint/restrict-template-expressions,@typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
      // @ts-ignore
      const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.idToken`,
        // @ts-ignore
        cognitoResponse.signInUserSession.idToken.jwtToken,
      );

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.accessToken`,
        // @ts-ignore
        cognitoResponse.signInUserSession.accessToken.jwtToken,
      );

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.refreshToken`,
        // @ts-ignore
        cognitoResponse.signInUserSession.refreshToken.token,
      );

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.clockDrift`,
        // @ts-ignore
        cognitoResponse.signInUserSession.clockDrift,
      );

      window.localStorage.setItem(
        // @ts-ignore
        `${cognitoResponse.keyPrefix}.LastAuthUser`,
        // @ts-ignore
        cognitoResponse.username,
      );
      /* eslint-enable @typescript-eslint/restrict-template-expressions,@typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */

      window.localStorage.setItem(
        "amplify-authenticator-authState",
        "signedIn",
      );
      log.snapshot("after");
      log.end();
    });
  },
);
