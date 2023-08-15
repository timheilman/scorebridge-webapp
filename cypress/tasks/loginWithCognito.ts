import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
export interface LoginWithCognitoParams {
  username: string;
  password: string;
}
export const loginWithCognito = {
  loginWithCognito({ username, password }: LoginWithCognitoParams) {
    cy.then(() =>
      Auth.signIn(username, password).then((cognitoUser: CognitoUser) => {
        const session = cognitoUser.getSignInUserSession();
        const idToken = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();
        const makeKey = (name: string) =>
          `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.${cognitoUser.username}.${name}`;
        cy.setLocalStorage(makeKey("accessToken"), accessToken);
        cy.setLocalStorage(makeKey("idToken"), idToken);
        cy.setLocalStorage(
          `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
          cognitoUser.username,
        );
      }),
    );
    cy.saveLocalStorage();
  },
};
