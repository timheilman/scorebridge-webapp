import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  loadProjectListAsync,
  selectProjectList,
  storeProject,
} from "../features/projectList/projectListSlice";
import { Project } from "./Project";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

function ProjectList() {
  const projects = useAppSelector(selectProjectList);
  const dispatch = useAppDispatch();
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    dispatch(loadProjectListAsync())
      .then(() => {
        setLoading(false);
      })
      .catch((reason) => {
        console.error("problems with async project list load", reason);
      });
  }, [projects, dispatch, setLoading]);

  function onSave() {
    dispatch(storeProject(projectBeingEdited as Project));
  }
  function handleEdit(project: Project) {
    setProjectBeingEdited(project);
    console.log(project);
  }

  function cancelEdit() {
    setProjectBeingEdited(null);
  }

  return loading ? (
    <p>loading...</p>
  ) : (
    <div className="row">
      {projects.map((project) => (
        <>
          <p>within</p>
          <div key={project.id} className="cols-sm">
            {project === projectBeingEdited ? (
              <ProjectForm
                onSave={onSave}
                onCancel={cancelEdit}
                project={project}
              />
            ) : (
              <ProjectCard project={project} onEdit={handleEdit} />
            )}
          </div>
          <p>beyond</p>
        </>
      ))}
    </div>
  );
}

export default ProjectList;
