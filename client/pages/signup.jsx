import axios from 'axios';
import React from 'react';

const test = () => {
  axios.get('http://localhost:3001/user/test')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    console.log(`${this.state.email} ${this.state.password}`);
  }

  render() {
    return (
      <div>
        signup
        <button onClick={test}>test</button>
        <input value={this.state.email} onChange={e => this.setState(prevState => {
          return {
            ...prevState,
            email: e.target.value
          };
        })
        } />
        <input value={this.state.password} onChange={e => this.setState(prevState => {
          return {
            ...prevState,
            password: e.target.value
          };
        })
        } />
        <button onClick={this.handleSubmit}></button>
      </div>
    );
  }
}

export default SignUp;
