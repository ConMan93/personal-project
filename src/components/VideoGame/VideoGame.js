import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

function VideoGame(props) {
        return ( props.isAuthenticated ?
            <div className={css(styles.game)}>
                <p className={css(styles.title)}>{props.name}</p>
                <Link to={`/game/${props.id}`}><img src={`${props.imgurl}`} alt=''  className={css(styles.gameImage)}/></Link>
                <p>Price: $60</p>
                <button onClick={() => props.addToCart(props)} className={css(styles.addButton)}>Add to cart</button>
            </div>
            :
            <div className={css(styles.game)}>
                <p className={css(styles.title)}>{props.name}</p>
                <Link to={`/game/${props.id}`}><img src={`${props.imgurl}`} alt=''  className={css(styles.gameImage)}/></Link>
                <p>Price: $60</p>
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
        background: 'white',
        border: '1px solid black',
        ':hover': {
            backgroundColor: 'crimson',
            color: 'white',
            border: '1px solid crimson'
        }
    }

})

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps)(VideoGame)

