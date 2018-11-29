import React, { Component } from 'react';
import './App.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLoggedIn } from './redux/reducer';
import axios from 'axios';
import { Elements, StripeProvider } from 'react-stripe-elements';

// Components
import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import DetailedView from './components/DetailedView/DetailedView';
import Cart from './components/Cart/Cart';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';

class App extends Component {

  constructor() {
    super();

    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    axios.get('/auth/currentuser').then( response => {
      if (response.data) {
        this.props.userLoggedIn(response.data)
      }

      this.setState({
        isLoading: false
      })
    })
  }

  render() {
    return ( this.state.isLoading ?
      <div></div>
      :
      <StripeProvider apiKey="pk_test_pX9CzSHms649fCkq1xdWw41l" >
        <HashRouter>
          <div style={{ height: '100vh', width: '100vw' }} className='body'>
            <Header />
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/cart' component={Cart} />
              <Route path='/game/:id' component={DetailedView} />
              <Elements>
                <Route path='/checkout' component={CheckoutForm} />
              </Elements>
            </Switch>
          </div>
        </HashRouter>
      </StripeProvider>
    );
  }
}

export default connect(null, { userLoggedIn })(App);
