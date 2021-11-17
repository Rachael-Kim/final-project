import axios from 'axios';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmedPassword: '',
      isShowErr: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.password !== this.state.confirmedPassword) {
      return this.setState({ isShowErr: true })
    }

    const body = { email: this.state.email, password: this.state.password };
    // Talk to backend
    axios.post('/api/auth/sign-up', body)
      .then((res) => {
        // Routed back to homepage
        this.props.history.push('/login');
      })
      .catch(function (error) {
        // handle error
      });
  }

  render() {
    return (
      <div className="signupContainer">


        <Form onSubmit={this.handleSubmit}>
          <h2>Sign Up</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control value={this.state.email} type="email" placeholder="Enter email" onChange={e => this.setState(prevState => {
              return {
                ...prevState,
                email: e.target.value
              };
            })
            } />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control value={this.state.confirmedPassword} type="password" placeholder="Confirm Password" onChange={e => this.setState(prevState => {
              return {
                ...prevState,
                confirmedPassword: e.target.value
              };
            })
            } />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          {this.state.isShowErr === true ? <p>Your passwords do not match!</p> : null}
        </Form>

      </div>
    );
  }
}

export default withRouter(SignUp);
