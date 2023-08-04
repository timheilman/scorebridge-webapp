import { ChangeEvent, SyntheticEvent, useState } from "react";

import { Project } from "./Project";

interface ProjectFormProps {
  project: Project;
  onCancel: () => void;
  onSave: (p: Project) => void;
}

function ProjectForm({
  project: initialProject,
  onCancel,
  onSave,
}: ProjectFormProps) {
  const [project, setProject] = useState(initialProject);
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault(); // we are taking over, in react, from browser event handling here
    onSave(project);
  };
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { type, name, value } = event.target;
    let checked = false;
    if (event.target instanceof HTMLInputElement) {
      checked = event.target.checked;
    }
    let updatedValue: string | boolean | number =
      type === "checkbox" ? checked : value;
    if (type === "number") {
      updatedValue = Number(value);
    }
    const change = {
      [name]: updatedValue,
    };
    console.log("setting project with change", change);
    setProject((p: Project) => ({ ...p, ...change }));
  };
  return (
    <form className="input-group vertical" onSubmit={handleSubmit}>
      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        name="name"
        placeholder="enter name"
        value={project.name}
        onChange={handleChange}
      />
      <label htmlFor="description">Project Description</label>

      <textarea
        name="description"
        placeholder="enter description"
        value={project.description}
        onChange={handleChange}
      ></textarea>
      <label htmlFor="budget">Project Budget</label>

      <input
        type="number"
        name="budget"
        placeholder="enter budget"
        value={project.budget}
        onChange={handleChange}
      />
      <label htmlFor="isActive">Active?</label>
      <input
        type="checkbox"
        name="isActive"
        checked={project.isActive}
        onChange={handleChange}
      />

      <div className="input-group">
        <button className="primary bordered medium">Save</button>
        <span></span>
        <button type="button" className="bordered medium" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}
export default ProjectForm;
