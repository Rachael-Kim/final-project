
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import SignUp from './components/Signup';
// import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';


import 'bootstrap/dist/css/bootstrap.min.css';
import './reset.css';
import './layout.css';
import './App.css';


function App() {

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signup">
          <Home />
        </Route>
        <Route exact path="/login">
          <Home />
        </Route>
        <Route exact path="/listing/:listingId">
          <Home />
        </Route>
        <Route exact path="/favorites">
          <Home />
        </Route>
      </Switch>

    </div>
  );
}

export default App;
