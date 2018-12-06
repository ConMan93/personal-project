import React, { Component } from 'react';
import axios from 'axios';
import mithril from 'mithril';
import { connect } from 'react-redux';
import { addGameToCart, getCart } from '../../redux/reducer';
import './DetailedView.css';

class DetailedView extends Component {

    constructor() {
        super();

        this.state = {
            game: [],
            developer: '',
            loading: true
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params

        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&filter=id:${id}`,
            callbackKey: "json_callback",
        }).then( response => {
            console.log(response)
            this.setState({
                game: response.results,
                loading: false
            })
        })

        if (this.props.isAuthenticated) {
            axios.get('/api/cart').then( response => {
                this.props.getCart(response.data)
            })
        }

        mithril.jsonp({
            url: `https://www.giantbomb.com/api/game/${id}/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp`,
            callbackKey: "json_callback",
        }).then( response => {
            if (response.results.developers) {
                this.setState({
                    developer: response.results.developers[0].name
                })
            }
        })

    }

    addToCart = (game, price) => {
        
        axios.post('/api/cart', { game, price: price }).then( response => {
            
            axios.get('/api/cart').then( response => {
                this.props.getCart(response.data)
            })
        })

    }

    render() {

        let gameCopy = this.state.game.map( e => e.original_release_date)
        
        let releaseDate = gameCopy[0]
        
        if (!this.state.loading) {
            if (releaseDate !== null && releaseDate !== undefined) {
                releaseDate = releaseDate.substring(0, 4)
            }
        }
        let price = 0
        if (releaseDate === null || releaseDate === undefined) {
            price = 5
        }
        else if (+releaseDate <= 1980) {
            price = 10
        }
        else if (+releaseDate >= 2018) {
            price = 60
        }
        else if (+releaseDate >= 2015) {
            price = 45
        }
        else if (+releaseDate >= 2010) {
            price = 30
        }
        else if (+releaseDate >= 2005) {
            price = 20
        }
        else if (+releaseDate > 1980 && +releaseDate < 2005) {
            price = 12
        }

        let gameToRender = this.state.game.map( (game, i) => {
            return (
                <div key={ i } className='game' >
                    <div className='game-image'>
                        <h2 className='game-name'>{game.name}</h2>
                        <img src={`${game.image.medium_url}`} alt='' style={{ width: 250, height: 250}} />
                        <p className='game-info'>Developed by: {this.state.developer}</p>
                        <p className='game-info'>Release Date: {game.original_release_date ? game.original_release_date.substring(0, 10) : 'No recorded release date'}</p>
                        {this.props.isAuthenticated ?
                        <div className='price-div'>
                            <p className='price'>${price}</p>
                            <button onClick={() => this.addToCart(game, price)} className='add-btn'>Add to cart</button>
                        </div>
                        :
                        <div></div>}
                    </div>
                    <div className='game-description'>
                        <p>Description:</p>
                        {game.description ?
                        <p className='desc-text'>{game.description.replace(/<(?:.|\n)*?>/gm, '')}</p>
                        :
                        game.deck ?
                        <p className='desc-text'>{game.deck}</p>
                        :
                        <p>No description</p>}
                    </div>   
                </div>
            )
        })
        
        return (
            <div>
                {gameToRender}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps, { addGameToCart, getCart })(DetailedView)