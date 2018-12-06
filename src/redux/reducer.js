const initialState = {
    isAuthenticated: false,
    user: {},
    cart: []
}

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
const ADD_TO_CART = 'ADD_TO_CART';
const GET_CART = 'GET_CART';
const UPDATE_USERNAME = 'UPDATE_USERNAME';

export default function reducer ( state = initialState, action ) {

    switch (action.type) {

        case USER_LOGGED_IN:
            return {...state, isAuthenticated: true, user: action.payload}

        case USER_LOGGED_OUT:
            return {...state, isAuthenticated: false, user: {}}

        case ADD_TO_CART:
            return {...state, cart: action.payload}

        case GET_CART:
            return {...state, cart: action.payload}

        case UPDATE_USERNAME:
            return {...state, user: {...state.user, username: action.payload}}

        default:
            return state

    }
}

export function userLoggedIn(user) {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export function userLoggedOut() {
    return {
        type: USER_LOGGED_OUT
    }
}

export function addGameToCart(games) {
    return {
        type: ADD_TO_CART,
        payload: games
    }
}

export function getCart(cart) {
    return {
        type: GET_CART,
        payload: cart
    }
}

export function updateUsername(username) {
    return {
        type: UPDATE_USERNAME,
        payload: username
    }
}