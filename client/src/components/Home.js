import React from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import Home1 from '../images/Home1.jpg';
import Home2 from '../images/Home2.jpg';
import Home3 from '../images/Home3.jpg';
import Home4 from '../images/Home4.jpg';
import Home5 from '../images/Home5.jpg';
import {AiOutlineHeart, AiFilledHeart} from 'react-icons/ai';

const Homes = [Home1, Home2, Home3, Home4, Home5];

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listings: []
    }
  }

  // Get listings on page load
  componentDidMount() {
    // Grab token from local storage
    const token = localStorage.getItem('token') || '';
    console.log(token)
    axios.get('/api/listings', {
      headers: {
        'X-Access-Header': token
      }
    })
      .then(res => {
        console.log(res.data);
        this.setState({ listings: res.data });
      })
  }

  render() {
    return (
      <div class="homeContainer">

      <h1>Listings</h1>

      <div className="listingsContainer">
        {this.state.listings.map(({ url, title_property, price, description }) => (
          <Card border="#9843c0" style={{ width: '22rem', border: "1px solid #9843c0" }}>
            <Card.Img variant="top" src={Homes[Math.floor(Math.random() * 5)]} />
            <Card.Body>
              <Card.Title>{title_property}</Card.Title>
              <Card.Text>
                {description.slice(0, 100)}
              </Card.Text>
              <Button style={{ backgroundColor: "#9843c0", color: 'white', border: '1px solid #9843c0' }}>View Details</Button>

            </Card.Body>
            <Card.Footer>
              <p>${price}</p>
              <AiOutlineHeart color="red" size="1.5em" />
            </Card.Footer>
          </Card>
        ))}
      </div>
   </div>
    )
  }
}

export default Home;
