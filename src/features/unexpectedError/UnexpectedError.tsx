import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";

import { gqlMutation } from "../../gql";
import { mutationUnexpectedError } from "../../graphql/mutations";

export default function UnexpectedError() {
  const [callResult, setCallResult] = useState<unknown | null>(null);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  useEffect(() => {
    gqlMutation(authStatus, mutationUnexpectedError)
      .then(() => {
        throw new Error(
          "This code is expected never to be reached; this throw indicates a test failure.",
        );
      })
      .catch((e) => {
        setCallResult(`Error received: ${JSON.stringify(e, null, 2)}`);
      });
  });
  return callResult ? (
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    <pre>{`${callResult}`}</pre>
  ) : (
    <p>awaiting an &quot;unexpected&quot; Error...</p>
  );
}
