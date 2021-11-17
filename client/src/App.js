import React from 'react';
import axios from 'axios';
import { Switch, Route, withRouter } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Listing from './components/Listing';
import Favorites from './components/Favorites';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reset.css';
import './layout.css';
import './App.css';
// PROPS - Share data between components
// BIG BIG BIG CAVEAT - You can only pass props from a parent component to a child component

// STATE - To update state, you use setState
// CAVEAT - You can only update state in the component that the state was defined in

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      favorites: [],
      listings: [],
    }

    this.setUser = this.setUser.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.sort = this.sort.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.fetchFavorites = this.fetchFavorites.bind(this);

  }

  fetchListings() {
    const token = localStorage.getItem('token');
    axios.get('/api/listings', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        this.setState({ listings: res.data });
      })
  }

  fetchFavorites() {
    const token = localStorage.getItem('token');
    axios.get('/api/favorites', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        this.setState({ favorites: res.data });
      })
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      return this.props.history.push('/login')
    }

    axios.get('/api/me', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        this.setUser(res.data);
      })
      .catch(err => {
        this.props.history.push('/login');
      })
  }

  setUser(user) {
    this.setState({ user: user });
    this.fetchFavorites();
    this.fetchListings();
  }

  addFavorite(listingId) {
    const token = localStorage.getItem('token');
    axios.post('/api/listing/favorite', { listing_id: listingId }, {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        const favorite = this.state.listings.find(listing => listing.listing_id === listingId);
        const likedFavorite = { favorite_id: res.data.favorite_id, ...favorite };
        this.setState({ favorites: [...this.state.favorites, likedFavorite] });
      })
      .catch(err => {
        alert(err);
      });
  }
  removeFavorite(listingId) {
    const token = localStorage.getItem('token');
    axios.delete(`/api/listing/favorite/${listingId}`, {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(res => {
        // Filter out the listing that the user favorited
        const favorites = this.state.favorites.filter(favorite => favorite.listing_id !== listingId);
        this.setState({ favorites });
      })
      .catch(err => {
        alert(err);
      });
  }

  sort(value) {
    switch (value) {
      case 'minPrice':
        this.setState({ listings: this.state.listings.sort((a, b) => a.price - b.price) });
        break;
      case 'maxPrice':
        this.setState({ listings: this.state.listings.sort((a, b) => b.price - a.price) });
        break;
      case 'date':
        this.setState({ listings: this.state.listings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar user={this.state.user} />
        <Switch>
          <Route exact path="/">
            <Home sort={this.sort} favorites={this.state.favorites} listings={this.state.listings} addFavorite={this.addFavorite} removeFavorite={this.removeFavorite} />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login setUser={this.setUser} />
          </Route>
          <Route exact path="/listing/:listingId">
            <Listing favorites={this.state.favorites} listings={this.state.listings} addFavorite={this.addFavorite} removeFavorite={this.removeFavorite} />
          </Route>
          <Route exact path="/favorites">
            <Favorites favorites={this.state.favorites} listings={this.state.listings} addFavorite={this.addFavorite} removeFavorite={this.removeFavorite} />
          </Route>
        </Switch>

      </div>
    );
  }
}

export default withRouter(App);
