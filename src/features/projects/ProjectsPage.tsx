import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

import ProjectList from "./ProjectList";

function ProjectsPage() {
  const { authStatus } = useAuthenticator();
  if (authStatus !== "authenticated") {
    return <Navigate to="/" />;
  }
  return (
    <>
      <h1>Projects</h1>
      <ProjectList />
    </>
  );
}

export default ProjectsPage;
