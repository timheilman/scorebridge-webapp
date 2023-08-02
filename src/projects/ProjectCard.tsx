import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Project } from "./Project";

export interface ProjectProps {
  project: Project;
  onEdit: (projectBeingEdited: Project) => void;
}

function formatDescription(description: string): string {
  return description.substring(0, 60) + "...";
}

function ProjectCard(props: ProjectProps) {
  const { project, onEdit } = props;
  const handleEditClick = (projectBeingEdited: Project) => {
    onEdit(projectBeingEdited);
  };
  return (
    <div className="card">
      <img src={project.imageUrl} alt={project.name} />
      <section className="section dark">
        <Link to={`/projects/${project.id as number}`}>
          <h5 className="strong">
            <strong>{project.name}</strong>
          </h5>
          <p>{formatDescription(project.description)}</p>
          <p>Budget : {project.budget.toLocaleString()}</p>
        </Link>
        <button className="bordered" onClick={() => handleEditClick(project)}>
          <span className="icon-edit "></span>
          Edit
        </button>
      </section>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.instanceOf(Project).isRequired,
};

export default ProjectCard;
