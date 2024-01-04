import { useEffect, useState } from "react";

import { mutationUnexpectedError } from "../../scorebridge-ts-submodule/graphql/mutations";
import { client } from "../../scorebridge-ts-submodule/react/gqlClient";
export default function UnexpectedError() {
  const [callResult, setCallResult] = useState<unknown>(null);
  useEffect(() => {
    client
      .graphql({ query: mutationUnexpectedError })
      .then(() => {
        throw new Error(
          "This code is expected never to be reached; this throw indicates a test failure.",
        );
      })
      .catch((e) => {
        setCallResult(e);
      });
  }, []);
  return callResult ? (
    <pre>{`${JSON.stringify(callResult)}`}</pre>
  ) : (
    <p>awaiting an &quot;unexpected&quot; Error...</p>
  );
}
