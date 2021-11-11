import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {MdOutlineHomeWork} from 'react-icons/md'
class AppNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }

  render() {
    return (
      <div>
        <Navbar expand="md">
          <Container>

            <Navbar.Brand as={Link} to={this.props.user ? "/" : "/login"}><MdOutlineHomeWork color="white" size="1.5em"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {!this.props.user ?
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/signup">Sign-Up</Nav.Link>
                  </>
                  :
                  <>
                    <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
                    <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                  </>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(AppNavbar);
