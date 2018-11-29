import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import mithril from 'mithril';
import { addGameToCart } from '../../redux/reducer';
import './HomePage.css';

import VideoGame from '../VideoGame/VideoGame';


class HomePage extends Component {


    constructor() {
        super();

        this.state = {
            games: [],
            offset: 20,
            consoleFilter: '',
            searchName: '',
            totalResults: ''
        }
    }

    componentDidMount() {

        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&sort=id:desc`,
            callbackKey: "json_callback",
        }).then ( response => {
            console.log(response)
            this.setState({
                games: response.results,
                totalResults: response.number_of_total_results
            })
        })

    }

    handleOptionChange = (input) => {
        this.setState({
            consoleFilter: input
        })

    }

    handleSearchChange = (input) => {
        this.setState({
            searchName: input
        })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.searchByName()
        }
    }

    addToCart = (game) => {
        axios.post('/api/cart', game).then( response => {
            this.props.addGameToCart(response.data)
        })

    }

    nextPage = () => {

        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&sort=id:desc&offset=${this.state.offset}&platforms=${this.state.consoleFilter}`,
            callbackKey: "json_callback",
        }).then( response => {
            console.log(response)
            this.setState({
                games: response.results,
                offset: this.state.offset + 20,
                totalResults: response.number_of_total_results
            })
        })

    }

    filter = () => {
    
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&sort=id:desc&filter=platforms:${this.state.consoleFilter},name:${this.state.searchName}&limit=20`,
            callbackKey: "json_callback",
        }).then( response => {
            console.log(response)
            this.setState({
                games: response.results,
                totalResults: response.number_of_total_results
            })
        })

    }

    searchByName = () => {
    
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&sort=id:desc&filter=name:${this.state.searchName}&limit=20`,
            callbackKey: "json_callback",
        }).then( response => {
            console.log(response)
            this.setState({
                games: response.results,
                searchName: '',
                totalResults: response.number_of_total_results
            })
        })
    }

    render() {
        let gamesToRender = this.state.games.map( (game, i) => {
            return (
                <VideoGame 
                key={ i }
                game_id={game.guid}
                id={game.id}
                name={game.name}
                imgurl={game.image.small_url}
                addToCart={this.addToCart}
                />
            )
        })
        return (
        <div className='display-body'>

            {/* <div class="view">
                <div class="plane main">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
            </div> */}


            <div className='games'>
                <p className='games-header'>{this.state.totalResults} Games</p>
                <div>
                    <button onClick={this.nextPage} className='next-button'>Next page</button>
                </div>
                <div className='search-bar'>
                    <input onChange={e => this.handleSearchChange(e.target.value)} value={this.state.searchName} placeholder='Search games by title' onKeyPress={this.handleKeyPress} className='search-input' />
                    <button onClick={this.searchByName} className='search-button'><i className="fas fa-search"></i></button>
                </div>
                <div className='home'>
                    {gamesToRender}
                </div>
                <div>
                    <button onClick={this.nextPage} className='next-button'>Next page</button>
                </div>
            </div>
            <div className='filter-options'>
                <h2 className='filter-header'>Filter Results</h2>
                <div className='filter-dropdown-div'>
                    <select className='filter-dropdown'>
                        <option>Sort by</option>
                        <option>Alphabetical</option>
                        <option>Release Date</option>
                    </select>
                    <select onChange={e => this.handleOptionChange(e.target.value)} className='filter-dropdown'>
                        <option value=''>All platforms</option>
                        <option value='37'>Sega Dreamcast</option>
                        <option value='3'>Gameboy</option>
                        <option value='57'>Gameboy Color</option>
                        <option value='4'>Gameboy Advance</option>
                        <option value='22'>Playstation 1</option>
                        <option value='19'>Playstation 2</option>
                        <option value='35'>Playstation 3</option>
                        <option value='146'>Playstation 4</option>
                        <option value='43'>Nintendo 64</option>
                        <option value='36'>Nintendo Wii</option>
                        <option value='117'>Nintendo 3DS</option>
                        <option value='23'>Gamecube</option>
                        <option value='32'>Xbox</option>
                        <option value='86'>Xbox 360</option>
                        <option value='145'>Xbox One</option>
                        <option value='94'>PC</option>
                    </select>
                    <select className='filter-dropdown'>
                        <option>All genres</option>
                    </select>
                    <select className='filter-dropdown'>
                        <option>All themes</option>
                    </select>  
                    <select className='filter-dropdown'>
                        <option>Minimum average score</option>
                        <option>no stars</option>
                        <option>1 star</option>
                        <option>2 stars</option>
                        <option>3 stars</option>
                        <option>4 stars</option>
                        <option>5 stars</option>
                    </select>  
                </div>
                <div className='filter-button-div'>
                    <button onClick={this.filter} className='filter-button'>Return matching games</button>
                </div>
            </div>
        </div>)
    }
}

export default connect(null, { addGameToCart })(HomePage)