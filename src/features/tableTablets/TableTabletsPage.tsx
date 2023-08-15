import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

export default function TableTabletsPage() {
  const { authStatus } = useAuthenticator();
  if (authStatus !== "authenticated") {
    return <Navigate to="/" />;
  }

  return <p>This is the table tablets page placeholder</p>;
}
