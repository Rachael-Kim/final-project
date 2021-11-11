import React from 'react';
import { Card, Button, Form, Dropdown, Modal } from 'react-bootstrap';
import Home1 from '../images/Home1.jpg';
import Home2 from '../images/Home2.jpg';
import Home3 from '../images/Home3.jpg';
import Home4 from '../images/Home4.jpg';
import Home5 from '../images/Home5.jpg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { Link, withRouter } from 'react-router-dom'
const Homes = [Home1, Home2, Home3, Home4, Home5];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderFavorites = this.renderFavorites.bind(this);
    this.state = {
      isShowModal: false,
      isCatFriendly: false,
      isDogFriendly: false,
      state: '',
      rooms: '',
      homeTypes: []
    }
    this.filterCheckbox = this.filterCheckbox.bind(this);
    this.filterSelect = this.filterSelect.bind(this);
    this.filterInput = this.filterInput.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.filterHomeType = this.filterHomeType.bind(this);
  }

  clearFilters() {
    this.setState({
      isCatFriendly: false,
      isDogFriendly: false,
      state: '',
      rooms: ''
    });
  }

  filterCheckbox(value, isChecked) {
    if (value === 'cat-friendly') {
      this.setState({ isCatFriendly: isChecked });
    } else if (value === 'dog-friendly') {
      this.setState({ isDogFriendly: isChecked });
    }
  }

  filterSelect(value) {
    if (value === 'ALL') {
      this.setState({ state: '' });
    } else {
      this.setState({ state: value });
    }
  }

  filterInput(value) {
    if (value === '' || +value < 0) {
      this.setState({ rooms: '' });
    } else {
      this.setState({ rooms: value });
    }
  }
  filterHomeType(value, isChecked) {
    if (isChecked) {
      this.setState({ homeTypes: [...this.state.homeTypes, value] });
    } else {
      this.setState({ homeTypes: this.state.homeTypes.filter(type => type !== value) });
    }
  }


  renderFavorites() {
    return (
      <section className="favoritesContainer">
        <h1>Your Favorites</h1>
        <div className="cards">
          {this.props.favorites.slice(0, 6).map(({ url, title_property, price, description, listing_id }) => (
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
        <div className="view_more_container">
          <Link className="view_more_favorites" to="/favorites">View Favorites</Link>
        </div>
      </section>
    )
  }

  render() {

    const filteredListings = this.props.listings.filter(listing => {
      if (this.state.state && listing.state !== this.state.state) {
        return false;
      }
      if (this.state.isCatFriendly && listing.is_cat_friendly === false) {
        return false;
      }
      if (this.state.isDogFriendly && listing.is_dog_friendly === false) {
        return false;
      }
      if (this.state.rooms > 0 && listing.num_of_rooms < +this.state.rooms) {
        return false;
      }

      if (this.state.homeTypes.length > 0 && !this.state.homeTypes.includes(listing.home_type)) {
        return false;
      }
      return true;
    })

    return (
      <div className="homeContainer">
        {this.props.favorites.length > 0 ?
          this.renderFavorites() : null
        }
        <h1>Listings</h1>
        <div className="sort-filter-container">
          <Form.Select onChange={e => this.props.sort(e.target.value)} aria-label="Sort Listings">
            <option value="minPrice">Sort Price from Low to High</option>
            <option value="maxPrice">Sort Price from High to Low</option>
            <option value="date">Sort By Newest First</option>
          </Form.Select>
          <Button className="button" onClick={() => this.setState({ isShowModal: !this.state.isShowModal })}>Filters</Button>
        </div>

        <Modal
          size="lg"
          show={this.state.isShowModal}
          onHide={() => this.setState({ isShowModal: false })}
          aria-labelledby="example-modal-sizes-title-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Filters
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Pets</Form.Label>
              <Form.Check value="cat-friendly" checked={this.state.isCatFriendly} type="checkbox" label="Cat-Friendly" onChange={e => this.filterCheckbox(e.target.value, e.target.checked)} />
              <Form.Check value="dog-friendly" checked={this.state.isDogFriendly} type="checkbox" label="Dog-Friendly" onChange={e => this.filterCheckbox(e.target.value, e.target.checked)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Select onChange={e => this.filterSelect(e.target.value)} aria-label="Select State">
                <option selected={this.state.state === "ALL"} value="ALL">All</option>
                <option selected={this.state.state === "AL"} value="AL">Alabama</option>
                <option selected={this.state.state === "AK"} value="AK">Alaska</option>
                <option selected={this.state.state === "AZ"} value="AZ">Arizona</option>
                <option selected={this.state.state === "AR"} value="AR">Arkansas</option>
                <option selected={this.state.state === "CA"} value="CA">California</option>
                <option selected={this.state.state === "CO"} value="CO">Colorado</option>
                <option selected={this.state.state === "CT"} value="CT">Connecticut</option>
                <option selected={this.state.state === "DE"} value="DE">Delaware</option>
                <option selected={this.state.state === "DC"} value="DC">District Of Columbia</option>
                <option selected={this.state.state === "FL"} value="FL">Florida</option>
                <option selected={this.state.state === "GA"} value="GA">Georgia</option>
                <option selected={this.state.state === "HI"} value="HI">Hawaii</option>
                <option selected={this.state.state === "ID"} value="ID">Idaho</option>
                <option selected={this.state.state === "IL"} value="IL">Illinois</option>
                <option selected={this.state.state === "IN"} value="IN">Indiana</option>
                <option selected={this.state.state === "IA"} value="IA">Iowa</option>
                <option selected={this.state.state === "KS"} value="KS">Kansas</option>
                <option selected={this.state.state === "KY"} value="KY">Kentucky</option>
                <option selected={this.state.state === "LA"} value="LA">Louisiana</option>
                <option selected={this.state.state === "ME"} value="ME">Maine</option>
                <option selected={this.state.state === "MD"} value="MD">Maryland</option>
                <option selected={this.state.state === "MA"} value="MA">Massachusetts</option>
                <option selected={this.state.state === "MI"} value="MI">Michigan</option>
                <option selected={this.state.state === "MN"} value="MN">Minnesota</option>
                <option selected={this.state.state === "MS"} value="MS">Mississippi</option>
                <option selected={this.state.state === "MO"} value="MO">Missouri</option>
                <option selected={this.state.state === "MT"} value="MT">Montana</option>
                <option selected={this.state.state === "NE"} value="NE">Nebraska</option>
                <option selected={this.state.state === "NV"} value="NV">Nevada</option>
                <option selected={this.state.state === "NH"} value="NH">New Hampshire</option>
                <option selected={this.state.state === "NJ"} value="NJ">New Jersey</option>
                <option selected={this.state.state === "NM"} value="NM">New Mexico</option>
                <option selected={this.state.state === "NY"} value="NY">New York</option>
                <option selected={this.state.state === "NC"} value="NC">North Carolina</option>
                <option selected={this.state.state === "ND"} value="ND">North Dakota</option>
                <option selected={this.state.state === "OH"} value="OH">Ohio</option>
                <option selected={this.state.state === "OK"} value="OK">Oklahoma</option>
                <option selected={this.state.state === "OR"} value="OR">Oregon</option>
                <option selected={this.state.state === "PA"} value="PA">Pennsylvania</option>
                <option selected={this.state.state === "RI"} value="RI">Rhode Island</option>
                <option selected={this.state.state === "SC"} value="SC">South Carolina</option>
                <option selected={this.state.state === "SD"} value="SD">South Dakota</option>
                <option selected={this.state.state === "TN"} value="TN">Tennessee</option>
                <option selected={this.state.state === "TX"} value="TX">Texas</option>
                <option selected={this.state.state === "UT"} value="UT">Utah</option>
                <option selected={this.state.state === "VT"} value="VT">Vermont</option>
                <option selected={this.state.state === "VA"} value="VA">Virginia</option>
                <option selected={this.state.state === "WA"} value="WA">Washington</option>
                <option selected={this.state.state === "WV"} value="WV">West Virginia</option>
                <option selected={this.state.state === "WI"} value="WI">Wisconsin</option>
                <option selected={this.state.state === "WY"} value="WY">Wyoming</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Rooms</Form.Label>
              <Form.Control name="rooms" value={this.state.rooms} type="number" min="0" onChange={e => this.filterInput(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>House Type</Form.Label>
              <Form.Check value="Co-Op" checked={this.state.homeTypes.includes('Co-Op')} type="checkbox" label="Co-Op" onChange={e => this.filterHomeType(e.target.value, e.target.checked)} />
              <Form.Check value="Apartment" checked={this.state.homeTypes.includes('Apartment')} type="checkbox" label="Apartment" onChange={e => this.filterHomeType(e.target.value, e.target.checked)} />
              <Form.Check value="Single Family Residence" checked={this.state.homeTypes.includes('Single Family Residence')} type="checkbox" label="Single Family Residence" onChange={e => this.filterHomeType(e.target.value, e.target.checked)} />
              <Form.Check value="Condominium" checked={this.state.homeTypes.includes('Condominium')} type="checkbox" label="Condominium" onChange={e => this.filterHomeType(e.target.value, e.target.checked)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearFilters}>Clear</Button>
            <Button className="button" onClick={() => { this.setState({ isShowModal: false }); }}>Search</Button>
          </Modal.Footer>
        </Modal>

        <div className="listingsContainer">
          {filteredListings.length === 0 && <h3>No Listings Available</h3>}
          {filteredListings.map(({ url, title_property, price, description, listing_id }) => (
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
      </div>
    )
  }
}

export default withRouter(Home);
