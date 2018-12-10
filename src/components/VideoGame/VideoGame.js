import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

function VideoGame(props) {

        let releaseDate = props.releaseDate
        if (props.releaseDate) {
            releaseDate = props.releaseDate.substring(0, 4)
        }
        let price = 0
        if (releaseDate === null) {
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

        return ( props.isAuthenticated ?
            <div className={css(styles.game)}>
                <p className={css(styles.title)}>{props.name}</p>
                <Link to={`/game/${props.id}`}><img src={`${props.imgurl}`} alt=''  className={css(styles.gameImage)}/></Link>
                <p>Price: ${price}</p>
                <button onClick={() => props.addToCart(props, price)} className={css(styles.addButton)}>Add to cart</button>
            </div>
            :
            <div className={css(styles.game)}>
                <p className={css(styles.title)}>{props.name}</p>
                <Link to={`/game/${props.id}`}><img src={`${props.imgurl}`} alt=''  className={css(styles.gameImage)}/></Link>
                <p>Price: ${price}</p>
            </div>
        )
}

const styles = StyleSheet.create({

    game: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: 200,
        color: 'white',
        marginTop: 20
    },

    title: {
        fontSize: 14,
        fontWeight: 600
    },

    gameImage: {
        height: 150,
        width: 150,
        boxShadow: '5px 5px 4px black'
    },

    addButton: {
        width: 75,
        borderRadius: 3,
        background: '#1D1F20',
        color: 'white',
        border: '1px solid black',
        ':hover': {
            backgroundColor: 'crimson',
            color: 'white',
            border: '1px solid crimson'
        },
        '@media (max-width: 450px)': {
            height: '25px'
        }
    }

})

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps)(VideoGame)

