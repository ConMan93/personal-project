import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import mithril from 'mithril';
import { addGameToCart, getCart } from '../../redux/reducer';
import './HomePage.css';

import VideoGame from '../VideoGame/VideoGame';


class HomePage extends Component {


    constructor() {
        super();

        this.state = {
            games: [],
            offset: 0,
            consoleFilter: '',
            searchName: '',
            totalResults: '',
            sortBy: '',
            loading: false,
            searched: false
        }
    }

    componentDidMount() {

        this.setState({
            loading: true
        })
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&sort=id:desc`,
            callbackKey: "json_callback",
        }).then ( response => {
            console.log(response)
            this.setState({
                games: response.results,
                totalResults: response.number_of_total_results,
                loading: false,
                searched: false,
                searchName: ''
            })
        })

        if (this.props.isAuthenticated) {
            
            axios.get('/api/cart').then( response => {
                this.props.getCart(response.data)
            })
        }

    }

    handleOptionChange = (input) => {
        this.setState({
            consoleFilter: input
        })

    }

    handleSortChange = (input) => {
        this.setState({
            sortBy: input
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

    addToCart = (game, price) => {
        axios.post('/api/cart', {game, price: price}).then( response => {
            axios.get('/api/cart').then( response => {
                this.props.getCart(response.data)
            })
        })

    }

    nextPage = () => {

        let offset = this.state.offset + 20
        this.setState({
            loading: true
        })
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&sort=${this.state.sortBy}:asc&offset=${offset}&filter=platforms:${this.state.consoleFilter},name:${this.state.searchName}`,
            callbackKey: "json_callback",
        }).then( response => {
            this.setState({
                games: response.results,
                offset: offset,
                totalResults: response.number_of_total_results,
                loading: false
            })
        })

    }

    previousPage = () => {

        let offset = this.state.offset - 20
        this.setState({
            loading: true
        })
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&limit=20&sort=${this.state.sortBy}:asc&offset=${offset}&filter=platforms:${this.state.consoleFilter},name:${this.state.searchName}`,
            callbackKey: "json_callback",
        }).then( response => {
            this.setState({
                games: response.results,
                offset: offset,
                totalResults: response.number_of_total_results,
                loading: false
            })
        })

    }

    filter = () => {
    
        this.setState({
            loading: true,
            searched: true
        })
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&sort=${this.state.sortBy}:asc&filter=platforms:${this.state.consoleFilter},name:${this.state.searchName}&limit=20`,
            callbackKey: "json_callback",
        }).then( response => {
            this.setState({
                games: response.results,
                totalResults: response.number_of_total_results,
                sortBy: '',
                loading: false
            })
        })

    }

    searchByName = () => {
    
        this.setState({
            loading: true,
            searched: true
        })
        mithril.jsonp({
            url: `https://www.giantbomb.com/api/games/?api_key=${process.env.REACT_APP_GIANT_BOMB_API_KEY}&format=jsonp&sort=id:desc&filter=name:${this.state.searchName}&limit=20`,
            callbackKey: "json_callback",
        }).then( response => {
            console.log(response)
            this.setState({
                games: response.results,
                // searchName: '',
                totalResults: response.number_of_total_results,
                loading: false
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
                releaseDate={game.original_release_date}
                price={0}
                />
            )
        })
        return (
        <div className='display-body'>

            


            <div className='games'>
                <p className='games-header'>{this.state.totalResults} Games</p>
                {this.state.searched && +this.state.totalResults > 20 ?
                <div>
                    <button onClick={this.nextPage} className='next-button'><i className="fas fa-forward"></i></button>
                    {this.state.offset > 0 ?
                    <button className='next-button' onClick={this.previousPage}><i className="fas fa-backward"></i></button>
                    :
                    <div></div>}
                </div>
                :
                <div></div>}
                <div className='search-bar'>
                    <input onChange={e => this.handleSearchChange(e.target.value)} value={this.state.searchName} placeholder='Search games by title' onKeyPress={this.handleKeyPress} className='search-input' />
                    <button onClick={this.searchByName} className='search-button'><i className="fas fa-search" style={{ color: 'white'}}></i></button>
                    <button onClick={() => this.componentDidMount()} className='reset-button'><i className="fas fa-sync-alt"></i></button>
                </div>
                {this.state.loading ?
                <p className="loading"><span>.</span><span>.</span><span>.</span></p>
                :
                <div className='home'>
                    {gamesToRender}
                </div>}
                {this.state.searched && +this.state.totalResults > 20 ?
                <div>
                    <button onClick={this.nextPage} className='next-button'><i className="fas fa-forward"></i></button>
                    {this.state.offset > 0 ?
                    <button className='next-button' onClick={this.previousPage}><i className="fas fa-backward"></i></button>
                    :
                    <div></div>}
                </div>
                :
                <div></div>}
            </div>
            
            <div className='filter-options'>
                <h2 className='filter-header'>Filter Results</h2>
                <div className='filter-dropdown-div'>

                    <select className='filter-dropdown' onChange={e => this.handleSortChange(e.target.value)}>
                        <option>Sort by</option>
                        <option value='name'>Alphabetical</option>
                        <option value='original_release_date'>Release Date</option>
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

                </div>
                <div className='filter-button-div'>
                    <button onClick={this.filter} className='filter-button'>Return matching games</button>
                </div>

            </div>

        </div>)
    }
}

function addStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(addStateToProps, { addGameToCart, getCart })(HomePage)