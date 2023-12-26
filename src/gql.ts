import {
  GeneratedSubscription,
  GraphQLVariablesV6,
} from "@aws-amplify/api-graphql/src/types";
import { GraphQLAuthMode } from "@aws-amplify/core/internals/utils";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

// left off here; need to use https://docs.amplify.aws/javascript/build-a-backend/troubleshooting/migrate-from-javascript-v5-to-v6/#api-graphql
// I probably will need to use an experimental project including the amplify CLI to
// get the graphQL query/mutation/subscription strings typed correctly; I
// can't figure out how to get the types working.
export function gqlMutation<
  FALLBACK_TYPES = unknown,
  TYPED_GQL_STRING extends string = string,
>(
  gqlOpString: TYPED_GQL_STRING,
  gqlOpVars: GraphQLVariablesV6<FALLBACK_TYPES, TYPED_GQL_STRING>,
  authMode: GraphQLAuthMode = "userPool",
) {
  return client.graphql({
    query: gqlOpString,
    variables: gqlOpVars,
    authMode,
  });
}

export function gqlSubscription<
  FALLBACK_TYPES,
  TYPED_GQL_STRING extends GeneratedSubscription<IN, SUB_OUT>,
>(
  gqlOpString: TYPED_GQL_STRING,
  gqlOpVars: GraphQLVariablesV6<FALLBACK_TYPES, TYPED_GQL_STRING>,
  authMode: GraphQLAuthMode = "userPool",
) {
  return client
    .graphql({
      query: gqlOpString,
      variables: gqlOpVars,
      authMode,
    })
    .subscribe();
}
