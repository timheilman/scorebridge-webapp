import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Project } from "./Project";
import ProjectDetail from "./ProjectDetail";

interface ProjectPageParams {
  projects: Project[];
}
function ProjectPage({ projects }: ProjectPageParams) {
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
