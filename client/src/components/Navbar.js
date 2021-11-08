import React from 'react';
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
class AppNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        user_id: null
      }
    };
  }

  render() {
    return (
      <div>
        <Navbar bg="light" expand="md">
          <Container>

            <Navbar.Brand href="#home">Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {this.state.user.email.length === 0 ?
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/signup">Sign-Up</Nav.Link>
                  </>
                  :
                  <>
                    <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
                    <Nav.Link as={Link} >Logout</Nav.Link>}
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

export default AppNavbar;
