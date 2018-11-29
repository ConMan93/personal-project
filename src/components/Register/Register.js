import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { userLoggedIn } from '../../redux/reducer';
import { Redirect, Link } from 'react-router-dom';
import './Register.css';

class Register extends Component {

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            username: '',
            errorMessage: ''
        }
    }

    handleChange = e => {
        let { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleErrorClick = () => {
        this.setState({
            errorMessage: ''
        })
    }

    handleClick = () => {
        axios.post('/auth/register', this.state).then( response => {
            this.props.userLoggedIn(response.data)
        }).catch( error => {
            this.setState({
                errorMessage: error.response.data
            })
        })
    }

    render() {
        return ( this.props.isAuthenticated ?
            <Redirect to='/' />
            :
            <div className='content'>
                {this.state.errorMessage ?
                <div className='error-message-div error-message'><p>{this.state.errorMessage}</p><button onClick={this.handleErrorClick} className='error-button'>X</button></div>
                :
                <div></div>}
                <div className='register-form'>
                    <h2 className='form-header' style={{ margin: 0 }}>Register</h2>

                    <div className='input-div'>
                        <h2 className='input-header'>Username</h2>
                        <input 
                        name='username'
                        value={this.state.username}
                        
                        onChange={this.handleChange}
                        className='register-input'
                        />
                    </div>

                    <div className='input-div'>
                        <h2 className='input-header'>Email</h2>
                        <input 
                        name='email'
                        value={this.state.email}
                        
                        onChange={this.handleChange}
                        className='register-input'
                        />
                    </div>

                    <div className='input-div'>
                        <h2 className='input-header'>Password</h2>
                        <input 
                        name='password'
                        value={this.state.password}
                        
                        onChange={this.handleChange}
                        className='register-input'
                        />
                    </div>

                    <div>
                        <button onClick={this.handleClick} className='register-btn'>Submit</button>
                    </div>

                    <p style={{ marginTop: 20 }}>Already have an account? <Link to='/login'>Log in</Link></p>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps, { userLoggedIn })(Register)