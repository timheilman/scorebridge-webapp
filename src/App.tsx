import "./App.css";

import HelloWorld from "./projects/HelloWorld";
import ProjectsPage from "./projects/ProjectsPage";
const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};

import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./home/HomePage";

export default function App() {
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
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/helloworld"
            element={<HelloWorld person={person} logo={logo} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
