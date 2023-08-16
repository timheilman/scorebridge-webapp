import { GraphQLQuery } from "@aws-amplify/api";
import { AuthStatus } from "@aws-amplify/ui";
import { API, graphqlOperation } from "aws-amplify";

export function gqlMutation<OUT>(
  authStatus: AuthStatus,
  gqlOpString: unknown,
  gqlOpVars: Record<string, unknown> = {},
) {
  const authMode: { authMode: "AMAZON_COGNITO_USER_POOLS" | "API_KEY" } = {
    authMode:
      authStatus === "authenticated" ? "AMAZON_COGNITO_USER_POOLS" : "API_KEY",
  };
  return API.graphql<GraphQLQuery<OUT>>({
    ...graphqlOperation(gqlOpString, gqlOpVars),
    ...authMode,
  });
}
