import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { Project } from "./Project";
import ProjectDetail from "./ProjectDetail";
import { selectProjectList } from "./projectListSlice";

function ProjectPage() {
  const projects = useAppSelector(selectProjectList);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [error /*, setError*/] = useState<string | null>(null);
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProject(projects[id - 1]);
      setLoading(false);
    }, 1000);
  }, [id, projects]);
  const { authStatus } = useAuthenticator();
  if (authStatus !== "authenticated") {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <>
        <h1>Project Detail</h1>

        {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse "></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}

        {project && <ProjectDetail project={project} />}
      </>
    </div>
  );
}

export default ProjectPage;
