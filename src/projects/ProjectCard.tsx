import PropTypes from "prop-types";

import { Project } from "./Project";

function formatDescription(description: string): string {
  return description.substring(0, 60) + "...";
}

function ProjectCard(props: { project: Project }) {
  const { project } = props;
  return (
    <div className="card">
      <img src={project.imageUrl} alt={project.name} />
      <section className="section dark">
        <h5 className="strong">
          <strong>{project.name}</strong>
        </h5>
        <p>{formatDescription(project.description)}</p>
        <p>Budget : {project.budget.toLocaleString()}</p>
      </section>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.instanceOf(Project).isRequired,
};

export default ProjectCard;
