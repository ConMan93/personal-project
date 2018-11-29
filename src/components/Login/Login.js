import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { userLoggedIn } from '../../redux/reducer';
import { StyleSheet, css } from 'aphrodite';


class Login extends Component {

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            errorMessage: ''
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
        axios.post('/auth/login', this.state).then( response => {
            this.props.userLoggedIn(response.data)
            this.setState({
                email: '',
                password: '',
            })
            }).catch(error => {
                this.setState({
                    errorMessage: error.response.data
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
                        <h2 className={css(styles.inputTitle)}>Email</h2>
                        <input
                        name='email'
                        onKeyPress={this.handleKeyPress}
                        value={this.state.email}
                        onChange={this.handleChange}
                        className={css(styles.input)}
                        />
                    </div>

                    <div className={css(styles.inputDiv)}>
                        <h2 className={css(styles.inputTitle)}>Password</h2>
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
                        <button onClick={this.handleClick} className={css(styles.loginButton)}>
                            Log in
                        </button>
                    </div>
                    <p>Need an account? <Link to='/register'>Register</Link></p>
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
        marginTop: 80
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
        outline: 'none'
    },

    loginButton: {
        padding: '6px 38px', 
        background: 'transparent', 
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