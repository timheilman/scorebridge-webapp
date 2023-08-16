import { Amplify, Auth } from "aws-amplify";
export interface LoginByCognitoApiParams {
  awsRegion: string;
  poolId: string;
  userPoolClientIdWeb: string;
  username: string;
  password: string;
}
let everRun = false;
export const loginByCognitoApi = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async loginByCognitoApi({
    awsRegion,
    poolId,
    userPoolClientIdWeb,
    username,
    password,
  }: LoginByCognitoApiParams) {
    console.log("Entering loginByCognitoApi...");
    if (!everRun) {
      console.log("Configuring amplify on first call...");
      Amplify.configure({
        Auth: {
          region: awsRegion,
          userPoolId: poolId,
          userPoolWebClientId: userPoolClientIdWeb, // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        },
      });
      console.log("setting everRun to true...");
      everRun = true;
    }
    // const log = Cypress.log({
    //   displayName: "COGNITO LOGIN",
    //   message: [`🔐 Authenticating | ${username}`],
    //   autoEnd: false,
    // });
    //
    // log.snapshot("before");

    console.log("calling signin");
    const signIn = Auth.signIn({ username, password });

    cy.wrap(signIn, { log: false }).then((cognitoResponse) => {
      const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;

      cy.window().localStorage.setItem(
        `${keyPrefixWithUsername}.idToken`,
        cognitoResponse.signInUserSession.idToken.jwtToken,
      );

      cy.window().localStorage.setItem(
        `${keyPrefixWithUsername}.accessToken`,
        cognitoResponse.signInUserSession.accessToken.jwtToken,
      );

      cy.window().localStorage.setItem(
        `${keyPrefixWithUsername}.refreshToken`,
        cognitoResponse.signInUserSession.refreshToken.token,
      );

      cy.window().localStorage.setItem(
        `${keyPrefixWithUsername}.clockDrift`,
        cognitoResponse.signInUserSession.clockDrift,
      );

      cy.window().localStorage.setItem(
        `${cognitoResponse.keyPrefix}.LastAuthUser`,
        cognitoResponse.username,
      );

      cy.window().localStorage.setItem(
        "amplify-authenticator-authState",
        "signedIn",
      );
      // log.snapshot("after");
      // log.end();
    });

    cy.visit("http://localhost:3000/");
    return null;
  },
};
