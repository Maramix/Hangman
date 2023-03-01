//npm run start
//npx json-server --watch data/db.json --port 8000
import Navbar from "./Navbar";
import Home from "./Home";
import "./index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="main">
        <Navbar />
        <div>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
