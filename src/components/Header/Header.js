import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLoggedOut } from '../../redux/reducer';
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


    userLoggedOut = () => {
        axios.get('/auth/logout').then( response => {
            this.props.userLoggedOut()
        })
    }

    render() {

        let total = this.state.cart.reduce((acc, cv) => {
            return acc + cv.quantity}, 0)
        
        return (
            <div className='nav-bar' >
                <div className='logo'>
                    <Link to='/' style={{ textDecoration: 'none' }} className='logo'>ConGames</Link>
                </div>
                {this.props.isAuthenticated ? 
                <div style={{display: 'flex', justifyContent: 'space-between', width: '55%', alignItems: 'center'}}>
                    <p className='user-greeting'>Hello, {this.props.user.username}</p>
                    <div className='nav-items'>
                        <Link to='/cart' className='nav-item' style={{ textDecoration: 'none' }}><i className="fas fa-shopping-cart"> []</i></Link>
                        <Link to='/'><button onClick={this.userLoggedOut} className='nav-item'>Logout</button></Link>
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

export default connect(mapStateToProps, { userLoggedOut })(Header)