import "./App.css";

import HelloWorld from "./projects/HelloWorld";
import ProjectsPage from "./projects/ProjectsPage";
const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};
import { useState } from "react";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./home/HomePage";
import { MOCK_PROJECTS } from "./projects/MockProjects";
import { Project } from "./projects/Project";
import ProjectPage from "./projects/ProjectPage";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  return (
    <Router>
      <header className="sticky">
        <span className="logo">
          <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" />
        </span>
        <NavLink to="/" className="button rounded">
          <span className="icon-home"></span>
          Home
        </NavLink>
        <NavLink to="/projects" className="button rounded">
          Projects
        </NavLink>
        <NavLink to="/helloworld" className="button rounded">
          Hello World Hands-On-React Examples
        </NavLink>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/projects"
            element={
              <ProjectsPage projects={projects} setProjects={setProjects} />
            }
          />
          <Route
            path="/projects/:id"
            element={<ProjectPage projects={projects} />}
          />
          <Route
            path="/helloworld"
            element={<HelloWorld person={person} logo={logo} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
