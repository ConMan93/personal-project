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
            game: []
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params

        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&filter=id:${id}`,
            callbackKey: "json_callback",
        }).then( response => {
            this.setState({
                game: response.results
            })
        })

        axios.get('/api/cart').then( response => {
            this.props.getCart(response.data)
        })

    }

    addToCart = (game) => {
        axios.post('/api/cart', { imgurl: game.image.medium_url, name: game.name, game_id: game.guid }).then( response => {
            // this.props.addGameToCart(response.data)
            this.componentDidMount()
        })

    }

    render() {
        let gameToRender = this.state.game.map( (game, i) => {
            return (
                <div key={ i } className='game'>
                    <div className='game-image'>
                        <h2 className='game-name'>{game.name}</h2>
                        <img src={`${game.image.medium_url}`} alt='' style={{ width: 250, height: 250}} />
                        <p>Release Date: {game.original_release_date}</p>
                        {this.props.isAuthenticated ?
                        <button onClick={() => this.addToCart(game)} className='add-btn'>Add to cart</button>
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