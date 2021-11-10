import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import Home1 from '../images/Home1.jpg';
import Home2 from '../images/Home2.jpg';
import Home3 from '../images/Home3.jpg';
import Home4 from '../images/Home4.jpg';
import Home5 from '../images/Home5.jpg';
import { withRouter } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
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
    console.log('file: Listing.js ~ line 28 ~ Favorites ~ componentDidMount ~ listingId', listingId);
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
        console.log('comment', res.data)
        this.setState({ comments: [...this.state.comments, res.data] });
      })
      .catch(function (error) {
        // handle error
      });
  }

  render() {
    const { url, title_property, price, description, listing_id } = this.state.listing;
    return (
      <div className="favorite">
        <section className="favoriteContainer">
          <h1>Listing</h1>
          <div className="card">
            {Object.keys(this.state.listing).length > 0 && (
              <Card key={listing_id} border="#9843c0" style={{ width: '22rem', border: "1px solid #9843c0" }}>
                <Card.Img variant="top" src={Homes[listing_id % 5]} />
                <Card.Body>
                  <Card.Title>{title_property}</Card.Title>
                  <Card.Text>
                    {description.slice(0, 100)}
                  </Card.Text>
                  <Button style={{ backgroundColor: "#9843c0", color: 'white', border: '1px solid #9843c0' }}>View Details</Button>
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
            )}
          </div>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Leave a comment</Form.Label>
              <Form.Control as="textarea" value={this.state.comment} placeholder="Max 250 characters" onChange={e => this.setState(prevState => {
                return {
                  ...prevState,
                  comment: e.target.value
                };
              })
              } />

            </Form.Group>

            <Button variant="primary" type="submit">
              Comment
            </Button>
          </Form>


          <div className="comments">
            {this.state.comments.map(({comment_id, body, timestamp, email}) => {
              return (
                <div className="comment" key={comment_id}>
                  <div className="comment-header">
                    <img alt="profile picture"/>
                    <p>{email}</p>
                  </div>
                  <p>
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
