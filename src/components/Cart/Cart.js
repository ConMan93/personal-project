import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { getCart } from '../../redux/reducer';
import { connect } from 'react-redux';


class Cart extends Component {

    constructor() {
        super();

        this.state = {
            cart: [],
            quantity: 1
        }
    }

    componentDidMount() {
        
        axios.get('/api/cart').then( response => {
            this.props.getCart(response.data)
            this.setState({
                cart: response.data
            })
        })
    }

    deleteFromCart(id) {
        axios.delete(`/api/cart/${id}`).then( response => {
            this.setState({
                cart: response.data
            })
            this.componentDidMount()
        })
    }

    updateQuantity = (id, val) => {

        axios.put(`/api/cart/${id}`, { val }).then( response => {
            this.setState({
                cart: response.data
            })
            this.componentDidMount()
        })
    }

    render() {

        let grandTotal = this.state.cart.map( e => {
            return +e.price * e.quantity})

        let cartToRender = this.state.cart.map( game => {
            let id = +game.game_id.substring(5)

        return (
            <div key={ game.id + '' } className={css(styles.gameDiv)}>

                <div className={css(styles.gameInfo)}>
                    <Link to={`/game/${id}`}><img src={`${game.imgurl}`} alt='' className={css(styles.gameImage)} /></Link>
                    <div className={css(styles.deleteBtnContainer)}>
                        <p className={css(styles.gameText)}>{game.name}</p>
                        <button onClick={() => this.deleteFromCart(game.id)} className={css(styles.deleteBtn, styles.button)}>Delete</button>
                    </div>
                </div>
                <div className={css(styles.gameText, styles.gamePrice)}>
                    <p>${game.price}</p>
                </div>
                <div>
                    <p className={css(styles.gameText)} style={{ textAlign: 'center'}}>{game.quantity}</p>
                    <button onClick={() => this.updateQuantity(game.id, 1)} className={css(styles.updateButton, styles.button)}>+</button><button onClick={() => this.updateQuantity(game.id, -1)} className={css(styles.updateButton, styles.button)}>-</button>
        
                </div>
            </div>
            )
        })

        let total = grandTotal.reduce((acc, cv) => {
            return acc + cv}, 0)
        let totalItems = this.state.cart.reduce( (acc, cv) => {
            return acc + cv.quantity
        }, 0)
            
        return (
            this.props.isAuthenticated ?
            <div className={css(styles.shoppingForm)}>
                <div className={css(styles.productForm)}>
                    <div className={css(styles.shoppingCartHeader, styles.gameText)}>
                        <h2 style={{ width: 300}}>Shopping Cart</h2>
                        <p>price</p>
                        <p>Quantity</p>
                    </div>
                    <div className={css(styles.gameContainer)}>
                        {cartToRender}
                    </div>
                </div>
                <div className={css(styles.totalForm)}>
                    <h3 className={css(styles.gameText)}>Total ({totalItems} items): ${total}</h3>
                    {this.state.cart.length < 1 ?
                    <div style={{ color: 'red'}}>Nothing in shopping cart!</div>
                    :
                    <Link to='/checkout'><button className={css(styles.checkoutBtn, styles.button)}>Proceed to checkout</button></Link>}
                </div>

            </div>
            :
            <Redirect to='/' />
        )
    }
}

const styles = StyleSheet.create({

    gameText: {
        color: 'white'
    },

    shoppingForm: {
        display: 'flex',
        padding: 10
    },

    totalForm: {
        // marginLeft: 120,
        position: 'fixed',
        right: 120,
        // border: '1px solid black',
        padding: 20,
        // borderRadius: 3,
        borderTop: '1px solid black',
        borderBottom: '1px solid black',
        marginTop: 78
    },

    shoppingCartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
       
    },

    productForm: {
        width: '70%',
        // marginRight: 'auto'
    },

    gameDiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTop: '1px solid black',
        height: 175
    },

    gameInfo: {
        display: 'flex',
        width: 300
    },

    gameImage: {
        height: 150,
        width: 150,
        boxShadow: '5px 5px 4px black'
    },

    gamePrice: {
        paddingRight: 20
    },

    deleteBtnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10
    },

    deleteBtn: {
        width: 75,
        borderRadius: 3,
        background: '#1D1F20',
        color: 'white'
    },

    checkoutBtn: {
        width: '100%',
        padding: '6px 38px',
        borderRadius: 3,
        background: '#1D1F20',
        color: 'white'
    },

    updateButton: {
        border: '1px solid black',
        marginLeft: '2px',
        marginRight: '2px',
        background: '#1D1F20',
        color: 'white',
        fontSize: 12
    },

    button: {
        borderRadius: 3,
        border: '1px solid black',
        ':hover': {
            backgroundColor: 'crimson',
            border: '1px solid crimson',
            color: 'white'
        }
    }
    
})

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps, { getCart })(Cart)