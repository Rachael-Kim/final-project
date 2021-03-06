import React from 'react';
import { Card, Button } from 'react-bootstrap';
import Home1 from '../images/Home1.jpg';
import Home2 from '../images/Home2.jpg';
import Home3 from '../images/Home3.jpg';
import Home4 from '../images/Home4.jpg';
import Home5 from '../images/Home5.jpg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { withRouter } from 'react-router-dom'
const Homes = [Home1, Home2, Home3, Home4, Home5];

class Listings extends React.Component {
  render() {
    return (
        <div className="listingsContainer">
          {this.props.filteredListings.length === 0 && <h3>No Listings Available</h3>}
          {this.props.filteredListings.map(({ url, title_property, price, description, listing_id }) => (
            <Card key={listing_id} border="#9843c0" style={{ width: '22rem', border: "1px solid #9843c0" }}>
              <Card.Img variant="top" src={Homes[listing_id % 5]} />
              <Card.Body>
                <Card.Title>{title_property}</Card.Title>
                <Card.Text>
                  {description.slice(0, 100)}
                </Card.Text>
                <Button
                  onClick={() => this.props.history.push(`/listing/${listing_id}`)}
                  style={{ backgroundColor: "#9843c0", color: 'white', border: '1px solid #9843c0' }}>View Details</Button>
              </Card.Body>
              <Card.Footer>
                <p>${price}</p>
                {this.props.favorites.findIndex(favorite => favorite.listing_id === listing_id) > -1 ?
                  <AiFillHeart onClick={() => this.props.removeFavorite(listing_id)} className="favorite-icon" color="red" size="1.5em" />
                  :
                  <AiOutlineHeart onClick={() => this.props.addFavorite(listing_id)} className="favorite-icon" color="red" size="1.5em" />
                }
              </Card.Footer>
            </Card>
          ))}
        </div>
    )
  }
}

export default withRouter(Listings);
