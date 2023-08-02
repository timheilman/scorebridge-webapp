import { Project } from "./Project";
import ProjectList from "./ProjectList";

interface ProjectsPageParams {
  projects: Project[];
  setProjects: (updatedProjects: Project[]) => void;
}
function ProjectsPage({ projects, setProjects }: ProjectsPageParams) {
  function saveProject(project: Project) {
    console.log("Saving project:", project);
    const updatedProjects = projects.map((p: Project) => {
      return p.id === project.id ? project : p;
    });
    setProjects(updatedProjects);
  }

  return (
    <>
      <h1>Projects</h1>
      <ProjectList onSave={saveProject} projects={projects} />
    </>
  );
}

export default ProjectsPage;
