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
            confirmPassword: '',
            username: '',
            errorMessage: '',
            loading: false
        }
    }

    handleChange = e => {
        let { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleClick()
        }
    }

    handleErrorClick = () => {
        this.setState({
            errorMessage: ''
        })
    }

    handleClick = () => {
        this.setState({
            loading: true
        })

        axios.post('/auth/register', this.state).then( response => {
            this.props.userLoggedIn(response.data)
        }).catch( error => {
            this.setState({
                errorMessage: error.response.data,
                loading: false
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
                        <h3 className='input-header'>Username</h3>
                        <input 
                        name='username'
                        value={this.state.username}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange}
                        className='register-input'
                        />
                    </div>

                    <div className='input-div'>
                        <h3 className='input-header'>Email</h3>
                        <input 
                        name='email'
                        value={this.state.email}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange}
                        className='register-input'
                        />
                    </div>

                    <div className='input-div'>
                        <h3 className='input-header'>Password</h3>
                        <input 
                        name='password'
                        value={this.state.password}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange}
                        className='register-input'
                        type='password'
                        />
                    </div>

                    <div className='input-div'>
                        <h3 className='input-header'>Confirm password</h3>
                        <input 
                        name='confirmPassword'
                        value={this.state.confirmPassword}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange}
                        className='register-input'
                        type='password'
                        />
                    </div>
                    
                    {this.state.loading ?
                    <p className="saving"><span>.</span><span>.</span><span>.</span></p>
                    :
                    <div>
                        <button onClick={this.handleClick} className='register-btn'>Submit</button>
                    </div>}

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