import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';


import 'bootstrap/dist/css/bootstrap.min.css';
import './reset.css';
import './layout.css';


function App() {

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/listing/:listingId">
          <SignUp />
        </Route>
        <Route exact path="/favorites">
          <SignUp />
        </Route>
      </Switch>

    </div>
  );
}

export default App;
