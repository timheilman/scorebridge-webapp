import { Project } from "./Project";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="row">
      {projects.map((p) => (
        <div key={p.id} className="cols-sm">
          <div className="card">
            <img src={p.imageUrl} alt={p.name} />
            <section className="section dark">
              <h5 className="strong">
                <strong>{p.name}</strong>
              </h5>
              <p>{p.description}</p>
              <p>Budget: {p.budget.toLocaleString()}</p>
            </section>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
