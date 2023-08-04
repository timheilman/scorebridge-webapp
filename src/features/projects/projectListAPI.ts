// A mock function to mimic making an async request for the projectList
import { MOCK_PROJECTS } from "./MockProjects";
import { Project } from "./Project";

export function fetchProjectList() {
  return new Promise<{ data: Project[] }>((resolve) =>
    setTimeout(() => resolve({ data: MOCK_PROJECTS }), 1000),
  );
}
