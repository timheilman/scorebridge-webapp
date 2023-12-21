import { useEffect, useState } from "react";

import { gqlMutation } from "../../gql";
import { mutationUnexpectedError } from "../../scorebridge-ts-submodule/graphql/mutations";

export default function UnexpectedError() {
  const [callResult, setCallResult] = useState<unknown>(null);
  useEffect(() => {
    gqlMutation(mutationUnexpectedError)
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
    <pre>{`${JSON.stringify(callResult)}`}</pre>
  ) : (
    <p>awaiting an &quot;unexpected&quot; Error...</p>
  );
}
