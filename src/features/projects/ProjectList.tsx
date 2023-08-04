import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Project } from "./Project";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import {
  loadProjectListAsync,
  selectProjectList,
  storeProject,
} from "./projectListSlice";

function ProjectList() {
  const projects = useAppSelector(selectProjectList);
  const dispatch = useAppDispatch();
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(loadProjectListAsync())
        .then(() => {
          setLoading(false);
        })
        .catch((reason) => {
          console.error("problems with async project list load", reason);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, loading, setLoading, projects]);

  function onSave(project: Project) {
    dispatch(storeProject(project));
    setProjectBeingEdited(null);
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
          <div key={project.id} className="cols-sm">
            {project.id === projectBeingEdited?.id ? (
              <ProjectForm
                onSave={onSave}
                onCancel={cancelEdit}
                project={project}
              />
            ) : (
              <ProjectCard project={project} onEdit={handleEdit} />
            )}
          </div>
        </>
      ))}
    </div>
  );
}

export default ProjectList;
