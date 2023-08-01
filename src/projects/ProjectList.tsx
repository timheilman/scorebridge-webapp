import { Project } from "./Project";
import ProjectCard from "./ProjectCard";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="row">
      {projects.map((p) => (
        <div key={p.id} className="cols-sm">
          <ProjectCard project={p} />
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
