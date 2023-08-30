import { useAuthenticator } from "@aws-amplify/ui-react";

import { FallbackForm } from "./FallbackForm";

export default function FallbackFormWhenUnauthenticated() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  if (authStatus !== "authenticated") {
    return (
      <>
        <p>Sessionless visit!</p>
        <FallbackForm />
      </>
    );
  }
  return null;
}
