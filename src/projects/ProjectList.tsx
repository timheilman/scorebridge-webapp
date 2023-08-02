import { Project } from "./Project";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="row">
      {projects.map((p) => (
        <div key={p.id} className="cols-sm">
          <ProjectCard project={p} onEdit={(p: Project) => console.log(p)} />
          <ProjectForm />
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
