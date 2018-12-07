import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { userLoggedIn } from '../../redux/reducer';
import { StyleSheet, css } from 'aphrodite';
import './Login.css';



class Login extends Component {

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
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

    handleClick = () => {
       
        this.setState({
            loading: true
        })
        axios.post('/auth/login', this.state).then( response => {
            
            this.props.userLoggedIn(response.data)
            this.setState({
                email: '',
                password: '',
                loading: false
            })
            }).catch(error => {
               
                this.setState({
                    errorMessage: error.response.data,
                    loading: false
                })
            })
        
    }

    handleErrorClick = () => {
        this.setState({
            errorMessage: ''
        })
    }

    render() {
        
        return ( this.props.isAuthenticated ?
            <Redirect to='/' />
            :
            <div>
                {this.state.errorMessage ?
                <div className={css(styles.errorMessageDiv)}><p>{this.state.errorMessage}</p><button onClick={this.handleErrorClick} className='error-button'>X</button></div>
                :
                <div></div>}
                <div className={css(styles.loginForm)}>

                    <h2 style={{ textAlign: 'center', margin: 0 }}>Log in</h2>
                    <div className={css(styles.inputDiv)}>
                        <h3 className={css(styles.inputTitle)}>Email</h3>
                        <input
                        name='email'
                        onKeyPress={this.handleKeyPress}
                        value={this.state.email}
                        onChange={this.handleChange}
                        className={css(styles.input)}
                        />
                    </div>

                    <div className={css(styles.inputDiv)}>
                        <h3 className={css(styles.inputTitle)}>Password</h3>
                        <input
                        type='password'
                        name='password'
                        
                        value={this.state.password}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        className={css(styles.input)}
                        />
                    </div>

                    <div>
                        {this.state.loading ?
                        <p className="saving"><span>.</span><span>.</span><span>.</span></p>
                        :
                        <button onClick={this.handleClick} className={css(styles.loginButton)}>
                            Log in
                        </button>}
                    </div>
                    <p>Need an account? <Link to='/register'>Register</Link> for free!</p>
                </div>
            </div>
            )
    }
}

const styles = StyleSheet.create({

    loginForm: {
        width: 400, 
        margin: '40px auto', 
        background: '#fff', 
        border: '5px solid #fff', 
        borderRadius: 5, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: 12, 
        marginTop: 80,
        boxShadow: '2px 2px 3px black',
        '@media (max-width: 400px)': {
            width: '345px'
        }
    },

    inputDiv: {
        marginBottom: 18, 
        boxSizing: 'border-box'
    },

    inputTitle: {
        margin: 0
    },

    input: {
        width: '90%', 
        height: 18, 
        padding: '8px 12px', 
        fontSize: 18, 
        borderRadius: 3, 
        border: '1px solid #ccc', 
        backgroundColor: 'rgb(250, 255, 189)',
        outline: 'none',
        boxShadow: '1px 2px 3px #e6ebf1',
        '-webkit-transition': 'box-shadow 150ms ease',
        transition: 'box-shadow 150ms ease',
        ':focus': {
            boxShadow: '1px 2px 3px #cfd7df'
        }
    },

    loginButton: {
        padding: '6px 38px', 
        background: '#1D1F20',
        color: 'white', 
        border: '1px solid grey', 
        borderRadius: 3, 
        fontSize: 16,
        marginBottom: 10,
        ':hover': {
            backgroundColor: 'crimson',
            color: 'white',
            border: '1px solid crimson'
        }
    },

    errorMessage: {
        color: 'red',
        fontSize: 12
    },

    errorMessageDiv: {
        width: '400px',
        backgroundColor: '#ffdce0',
        color: '#86181d',
        margin: '10px auto',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: '5px',
        border: '1px solid black',
        textAlign: 'center'
    },

    errorButton: {
        background: 'transparent',
        border: 'none',
        fontSize: '16px'
    }

})

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps, { userLoggedIn })(Login)