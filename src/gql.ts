import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

export function gqlMutation<OUT>(
  gqlOpString: unknown,
  gqlOpVars: Record<string, unknown> = {},
  authMode:
    | "AMAZON_COGNITO_USER_POOLS"
    | "API_KEY" = "AMAZON_COGNITO_USER_POOLS",
) {
  return API.graphql<GraphQLQuery<OUT>>({
    ...graphqlOperation(gqlOpString, gqlOpVars),
    ...{
      authMode,
    },
  });
}
