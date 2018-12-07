import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLoggedOut, getCart } from '../../redux/reducer';
import axios from 'axios';
import './Header.css';

class Header extends Component {

    constructor() {
        super();

        this.state = {
            cart: [],
            retrievedCart: false
        }
    }

    
    componentDidMount() {
        if (this.props.isAuthenticated) {
            axios.get('/api/cart').then( response => {
                this.props.getCart(response.data)
                this.setState({
                    cart: response.data,
                    retrievedCart: true
                })
            }).catch(error => {
                
            })
        }
        
    }

    userLoggedOut = () => {
        axios.get('/auth/logout').then( response => {
            this.props.userLoggedOut()
            this.props.history.push('/')
        })
    }

    render() {
        
            let total = this.props.cart.reduce((acc, cv) => {
                return acc + cv.quantity}, 0)
        
        
        return (
            <div className='nav-bar' >
                <div className='logo'>
                    <Link to='/' style={{ textDecoration: 'none' }} className='logo'>ConGames</Link>
                </div>
                {this.props.isAuthenticated ? 
                <div style={{display: 'flex', justifyContent: 'space-between', width: '55%', alignItems: 'center'}}>
                    <p><p className='user-greeting'> </p><Link to={`/profile/${this.props.user.username}`} className='profile-link'>{this.props.user.username}</Link></p>
                    <div className='nav-items'>
                        <Link to='/cart' className='nav-item' style={{ textDecoration: 'none' }}><i className="fas fa-shopping-cart"> [{total}]</i></Link>
                        <button onClick={this.userLoggedOut} className='nav-item logged-in'>Logout</button>
                    </div>
                </div>
                :
                <div className='nav-items' style={{ alignItems: 'center' }}>
                    <Link to='/login'><button className='nav-item'>Log in</button></Link>
                    <Link to='/register'><button className='nav-item'>Register</button></Link>
                </div>
                    }

            </div>
        )
    }
}

function mapStateToProps(state) {
    let { isAuthenticated, user, cart } = state
    return {
        isAuthenticated,
        user,
        cart
    }
}

export default connect(mapStateToProps, { userLoggedOut, getCart })(Header)