import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

export default function SignOutButton() {
  const { signOut, authStatus } = useAuthenticator();

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
  return <Navigate to="/" />;
}
