import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';


import 'bootstrap/dist/css/bootstrap.min.css';
import './reset.css';
import './layout.css';
import './App.css';
import axios from 'axios';


// PROPS - Share data between components
// BIG BIG BIG CAVEAT - You can only pass props from a parent component to a child component

// STATE - To update state, you use setState
// CAVEAT - You can only update state in the component that the state was defined in

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }

    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login')
    } else {
      axios.get('/api/me', {
        headers: {
          'X-Access-Token': token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({user: res.data});
      })
      .catch(err => {
        console.log('invalid token.. redirecting to login')
        this.props.history.push('/login');
      })
    
    }
  }

  setUser(user) {
    this.setState({user: user});
  }


  render() {
    // console.log(this.state.user);
    return (
      <div className="App">
        <Navbar user={this.state.user} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login setUser={this.setUser}/>
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
}

export default withRouter(App);
