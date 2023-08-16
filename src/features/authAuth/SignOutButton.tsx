import { useAuthenticator } from "@aws-amplify/ui-react";

export default function SignOutButton() {
  const { signOut, authStatus } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
  ]);

  const handleClick = () => {
    signOut();
  };

  if (authStatus === "authenticated") {
    return (
      <>
        <button onClick={handleClick}>Sign Out</button>
      </>
    );
  }
  return null;
}
