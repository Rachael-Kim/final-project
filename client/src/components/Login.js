import axios from 'axios';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();


    axios.post('/api/auth/sign-in', { email: this.state.email, password: this.state.password })
      .then((res) => {
        // res contains token, and user information

        // Set the user state in the app.js USING the setUser method that we passed to this component
        this.props.setUser(res.data.user);

        // store token in local storage
        localStorage.setItem('token', res.data.token)
        // redirect them to homepage
        this.props.history.push('/');

      })
      .catch(function (error) {
        // handle error
      });
  }

  render() {
    return (
      <div className="loginContainer">
        <Form onSubmit={this.handleSubmit}>
          <h2>Login</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control value={this.state.email} type="email" placeholder="Enter email" onChange={e => this.setState(prevState => {
              return {
                ...prevState,
                email: e.target.value
              };
            })
            } />

          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control value={this.state.password} type="password" placeholder="Password" onChange={e => this.setState(prevState => {
              return {
                ...prevState,
                password: e.target.value
              };
            })
            } />
          </Form.Group>
          <Link to="/signup">Don't have an account? Click here to register.</Link>
          <Button style={{marginTop: '16px', display: 'block'}} variant="primary" type="submit">
            Login
          </Button>
        </Form>

      </div>
    );
  }
}

export default withRouter(Login);
