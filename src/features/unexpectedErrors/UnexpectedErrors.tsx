import { GraphQLQuery } from "@aws-amplify/api";
import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";

import { UnexpectedErrorResponse } from "../../../appsync";
import { mutationUnexpectedError } from "../../graphql/mutations";

const unexpectedErrorCall = async (authStatus: AuthStatus) => {
  const authMode: { authMode: "AMAZON_COGNITO_USER_POOLS" | "API_KEY" } = {
    authMode:
      authStatus === "authenticated" ? "AMAZON_COGNITO_USER_POOLS" : "API_KEY",
  };
  return API.graphql<GraphQLQuery<UnexpectedErrorResponse>>({
    ...graphqlOperation(mutationUnexpectedError, {}),
    ...authMode,
  });
};

export default function UnexpectedErrors() {
  const [callResult, setCallResult] = useState<unknown | null>(null);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  useEffect(() => {
    unexpectedErrorCall(authStatus)
      .then(() => {
        throw new Error(
          "This code is expected never to be reached; this throw indicates a test failure.",
        );
      })
      .catch((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
        setCallResult(
          `Error received as expected: ${JSON.stringify(e, null, 2)}`,
        );
      });
  });
  return callResult ? (
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    <pre>{`${callResult}`}</pre>
  ) : (
    <p>awaiting an &quot;unexpected&quot; Error...</p>
  );
}
