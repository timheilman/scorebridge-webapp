// cypress/support/auth-provider-commands/cognito.ts

import { Amplify } from "aws-amplify";

import requiredCypressEnvVar from "../requiredCypressEnvVar";

// Amazon Cognito
Cypress.Commands.add(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "loginByCognitoApi",
  (username: string, password: string) => {
    Cypress.log({
      displayName: "exploring amplify v6: getConfig",
      message: [`here: ${JSON.stringify(Amplify.getConfig(), null, 2)}`],
      autoEnd: true,
    });
    const log = Cypress.log({
      displayName: "COGNITO LOGIN",
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });

    log.snapshot("before");

    cy.task("fetchJwts", { username, password }).then((jwts) => {
      Cypress.log({
        displayName: "exploring amplify v6",
        message: [`here: ${JSON.stringify(jwts, null, 2)}`],
        autoEnd: true,
      });
      cy.task("log", {
        catPrefix: "cypress.support.authProviderCommands.cognito.",
        catSuffix: "fetchJwts",
        logLevel: "info",
        addlParams: [jwts],
      });
      // The following is some voodoo found on webpages from before TypeScript
      // also, it seems as though this was all before Cognito got a good API
      // in place, and just slurps from internals.  It's ugly but it works.
      /* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
      // @ts-ignore
      const keyPrefix = `CognitoIdentityServiceProvider.${requiredCypressEnvVar(
        "COGNITO_USER_POOL_CLIENT_ID_WEB",
      )}`;
      const keyPrefixWithUsername = `${keyPrefix}.${jwts.userSub}`;

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.idToken`,
        // @ts-ignore
        jwts.idToken,
      );

      window.localStorage.setItem(
        `${keyPrefixWithUsername}.accessToken`,
        // @ts-ignore
        jwts.accessToken,
      );

      // window.localStorage.setItem(
      //   `${keyPrefixWithUsername}.refreshToken`,
      //   @ts-ignore
      // cognitoResponse.signInUserSession.refreshToken.token,
      // );

      // window.localStorage.setItem(
      //   `${keyPrefixWithUsername}.clockDrift`,
      // @ts-ignore
      // cognitoResponse.signInUserSession.clockDrift,
      // );

      // @ts-ignore
      window.localStorage.setItem(`${keyPrefix}.LastAuthUser`, jwts.userSub);
      /* eslint-enable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */

      // window.localStorage.setItem(
      //   "amplify-authenticator-authState",
      //   "signedIn",
      // );
      log.snapshot("after");
      log.end();
    });
  },
);
