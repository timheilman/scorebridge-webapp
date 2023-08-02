import { useState } from "react";

import { Project } from "./Project";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

function ProjectList({ projects }: { projects: Project[] }) {
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | null>(
    null,
  );
  function handleEdit(project: Project) {
    setProjectBeingEdited(project);
    console.log(project);
  }

  function cancelEdit() {
    setProjectBeingEdited(null);
  }

  return (
    <div className="row">
      {projects.map((project) => (
        <div key={project.id} className="cols-sm">
          {project === projectBeingEdited ? (
            <ProjectForm onCancel={cancelEdit} />
          ) : (
            <ProjectCard project={project} onEdit={handleEdit} />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
