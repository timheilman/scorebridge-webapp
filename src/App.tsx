import "./App.css";

import HelloWorld from "./projects/HelloWorld";
import ProjectsPage from "./projects/ProjectsPage";
const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};

function App() {
  return (
    <div className="container">
      <ProjectsPage />
      <HelloWorld person={person} logo={logo} />
    </div>
  );
}

export default App;
