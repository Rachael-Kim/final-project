import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import Home1 from '../images/Home1.jpg';
import Home2 from '../images/Home2.jpg';
import Home3 from '../images/Home3.jpg';
import Home4 from '../images/Home4.jpg';
import Home5 from '../images/Home5.jpg';
import { withRouter } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BiBed, BiBath } from 'react-icons/bi';
import { BsHouseDoor } from 'react-icons/bs';
import { GiHollowCat } from 'react-icons/gi';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaDog } from 'react-icons/fa';
import axios from 'axios';
const Homes = [Home1, Home2, Home3, Home4, Home5];

class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listing: {},
      comments: [],
      comment: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const listingId = this.props.match.params.listingId;
    axios.get(`/api/listing/${listingId}`, {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        this.setState({ listing: res.data, comments: res.data.comments });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.comment.length === 0) {
      return;
    }
    const token = localStorage.getItem('token')
    axios.post('/api/comment', { comment: this.state.comment, listing_id: this.props.match.params.listingId },
      {
        headers: {
          'X-Access-Token': token
        }
      }
    )
      .then((res) => {
        this.setState({ comments: [res.data, ...this.state.comments] });
      })
      .catch(function (error) {
        // handle error
      });
  }

  render() {
    const { url, title_property, price, description, listing_id, city, state, home_type, is_cat_friendly, is_dog_friendly, num_of_rooms, timestamp } = this.state.listing;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <div className="listingContainer">
        <section className="favoriteContainer">
          <div>
            {Object.keys(this.state.listing).length > 0 && (
              <div className="listing">
                {this.props.favorites.findIndex(favorite => favorite.listing_id === listing_id) > -1 ?
                  <Button onClick={() => this.props.removeFavorite(listing_id)} className="favorite-button" >Favorited</Button>
                  :
                  <Button onClick={() => this.props.addFavorite(listing_id)} className="favorite-button">Add to Favorites</Button>
                }
                <h1>{title_property}</h1>
                <div className="header-info">
                  <p>{city}, {state}</p>
                  <p>Listed: {formattedDate}</p>
                </div>
                <img src={Homes[listing_id % 5]} />
                <div className="separator"></div>
                <div className="listing-details">
                  <div className="body-information-container">
                    <BsHouseDoor size="1.5em" />
                    <p>{home_type}</p>
                  </div>
                  <div className="body-information-container">
                    <MdOutlineAttachMoney size="1.5em" />
                    <p>{price}/night</p>
                  </div>
                  <div className="body-information-container">
                    <BiBed size="1.5em" />
                    <p>{num_of_rooms} bedrooms</p>
                  </div>
                  <div className="body-information-container">
                    <BiBath size="1.5em" />
                    <p>{num_of_rooms} baths</p>
                  </div>
                  <div className="body-information-container">
                    <GiHollowCat size="1.5em" />
                    <p>{is_cat_friendly ? 'Cat Friendly' : 'No Cats Allowed'}</p>
                  </div>
                  <div className="body-information-container">
                    <FaDog size="1.5em" />
                    <p>{is_dog_friendly ? 'Dog Friendly' : 'No Dogs Allowed'}</p>
                  </div>
                </div>

                <div className="separator"></div>

                <h3 style={{ marginBottom: '24px' }}>Learn More</h3>
                <p>{description}</p>

                <div className="separator"></div>


              </div>
            )}
          </div>

          <Form onSubmit={this.handleSubmit} style={{ marginTop: '80px'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label as="h4">Leave a comment</Form.Label>
              <Form.Control as="textarea" style={{ height: '100px' }} value={this.state.comment} placeholder="Max 250 characters" onChange={e => this.setState(prevState => {
                return {
                  ...prevState,
                  comment: e.target.value
                };
              })
              } />

            </Form.Group>

            <Button className="button comment-button" variant="primary" type="submit">
              Comment
            </Button>
          </Form>


          <div className="comments">
            {this.state.comments.map(({ comment_id, body, timestamp, email }) => {
              const date = new Date(timestamp);
              const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
              return (
                <div className="comment" key={comment_id}>
                  <div className="comment-header">
                    <div className="circle">
                      <span>{email[0].toUpperCase()}</span>
                    </div>
                    <div className="person">
                      <p>{email}</p>
                      <p>{formattedDate}</p>
                    </div>
                  </div>
                  <p class="comment_body">
                    {body}
                  </p>
                </div>
              )
            })}
          </div>

        </section>
      </div>
    )
  }
}

export default withRouter(Favorites);
