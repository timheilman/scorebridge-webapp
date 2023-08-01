import "./App.css";

import HelloWorld from "./projects/HelloWorld";
import ProjectsPage from "./projects/ProjectsPage";

function App() {
  return (
    <div className="container">
      <ProjectsPage />
      <HelloWorld />
    </div>
  );
}

export default App;
