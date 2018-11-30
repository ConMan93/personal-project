import React, {Component} from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import { getCart } from '../../redux/reducer';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
        complete: false,
        user: {},
        cart: [],
        errorMessage: '',

    }
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    axios.get('/auth/currentuser').then( response => {
      this.setState({
        user: response.data
      })
    })
    axios.get('/api/cart').then( response => {
      this.props.getCart(response.data)
      this.setState({
        cart: response.data
      })
    })

  }

  handleErrorClick = () => {
    this.setState({
        errorMessage: ''
    })
  }

  async submit(ev) {

    try {
      let total = this.state.cart.reduce((acc, cv) => {
        return acc + cv.quantity}, 0)
      
      let {token} = await this.props.stripe.createToken({name: `${this.state.user.username}`});
      let response = await axios.post('/charge', {headers: {"Content-Type": "text/plain"}, data: {token: token.id}, amount: total * 60})
      console.log(response)

      if (response.status === 200) this.setState({ complete: true })
    }
    catch (error) {
      this.setState({
        errorMessage: 'Invalid payment information!'
      })
    }

    this.componentDidMount()

  }

  render() {
    let total = this.state.cart.reduce((acc, cv) => {
      return acc + cv.quantity}, 0)

    let gamesTotal = this.state.cart.map( (game, i) => {
      return (
        <div key={ i } className='total-form-content'>
          <p>{game.name} x{game.quantity}</p>
        </div>
      )
    })

    if (this.state.complete) return <h1 className='complete'>Purchase Completed!</h1>

    return (

      <div>
        {this.state.errorMessage ?
        <div className='error-message-div error-message'><p>{this.state.errorMessage}</p><button onClick={this.handleErrorClick} className='error-button'>X</button></div>
        :
        <div></div>}

        <div className='payment-form'>
          
          <form className="checkout" id='payment-form'>
            <p className='purchase-header'>Would you like to complete the purchase?</p>
            <p>Card Number</p>
            <CardNumberElement className='card-input card-number' />
            <div className='exp-cvc-form'>
              <div>
                <p>Expiration Date</p>
                <CardExpiryElement className='card-input card-exp' />
              </div>
              <div>
                <p>Security Code</p>
                <CardCVCElement className='card-input card-cvc' />
              </div>
            </div>
            <p>Zip</p>
            <PostalCodeElement className='card-input card-zip' />
            <button onClick={this.submit} className='purchase-btn' type='submit'>Purchase</button>
          </form>

          <div className='total-form'>
            <h3>Order Summary</h3>
            {gamesTotal}
            <h3 style={{ color: 'crimson'}} className='total-form-content'>Order total: ${total * 60}</h3>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(null, { getCart })(injectStripe(CheckoutForm));