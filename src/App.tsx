import "./App.css";

import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import CounterApp from "./CounterApp";
import HomePage from "./home/HomePage";
import HelloWorld from "./projects/HelloWorld";
import ProjectPage from "./projects/ProjectPage";
import ProjectsPage from "./projects/ProjectsPage";

const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};

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
          ProjectNavLink
        </NavLink>
        <NavLink to="/helloworld" className="button rounded">
          Hello World Hands-On-React Examples
        </NavLink>
        <NavLink to="/counter" className="button rounded">
          Redux repo example counter-ts
        </NavLink>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route
            path="/helloworld"
            element={<HelloWorld person={person} logo={logo} />}
          />
          <Route path="/counter" element={<CounterApp />} />
        </Routes>
      </div>
    </Router>
  );
}
