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
import UserProfile from './components/UserProfile/UserProfile';

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
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY} >
        <HashRouter>
          <div style={{ height: '100vh', maxWidth: '1063', width: '1063' }} className='body'>
            {/* <Header {...props}/>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/cart' component={Cart} />
              <Route path='/game/:id' component={DetailedView} />
              <Route path='/profile/:id' component={UserProfile} />
              <Elements>
                <Route path='/checkout' component={CheckoutForm} />
              </Elements>
            </Switch> */}
            <Route path="/" render={(props) => {
              return (
                <div>
                  <Header {...props}/>
                  <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/cart' component={Cart} />
                    <Route path='/game/:id' component={DetailedView} />
                    <Route path='/profile/:id' component={UserProfile} />
                    <Elements>
                      <Route path='/checkout' component={CheckoutForm} />
                    </Elements>
                  </Switch>
                </div>
              )
            }}/>
          </div>
        </HashRouter>
      </StripeProvider>
    );
  }
}

export default connect(null, { userLoggedIn })(App);
