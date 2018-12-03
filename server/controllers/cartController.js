
module.exports = {
    
    getCart: async (req, res) => {

        try {
        let db = req.app.get('db')
        let { id } = req.session.user

        
        let cart = await db.getCart([id])

        res.send(cart)
        } catch(error) {
            console.log('there was an error getting cart', error)
        }

    },

    addToCart: async (req, res) => {

        try {


            let db = req.app.get('db')
            let { price } = req.body
            
            let { game_id, imgurl, name } = req.body.game
            if (req.body.game.image) {
                game_id = req.body.game.guid
                imgurl = req.body.game.image.small_url
                name = req.body.game.name
            }
            
            let { id } = req.session.user
            let quantity = 1

            if (!req.session.user.cart_id) {
                let cart = await db.createCart({id})
                req.session.user.cart_id = cart[0].id
            }

            let alreadyInCart = await db.findGameByGameId({game_id, cart_id: req.session.user.cart_id})
            if (alreadyInCart[0]) {
                let { id } = alreadyInCart[0]
                let games = await db.updateQuantity({ id, val: 1 })
                return res.send(games)
            }   
            let games = await db.addGameToCart({ cart_id: req.session.user.cart_id, game_id, price, quantity, imgurl, name })
            return res.send(games)

        } catch(error) {

            console.log('Error adding to cart', error)
            res.status(500).send(error)

        }
    },

    deleteFromCart: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { id } = req.params

            let games = await db.deleteFromCart({id: +id})

            id = req.session.user.id
            let response = await db.getCart([+id])
            res.send(response)

        } catch(error) {

            console.log('Error deleting from cart', error)
            res.status(500).send(error)

        }

    },

    updateQuantity: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { id } = req.params
            let { val } = req.body

            let cart = await db.updateQuantity({ id, val})
                if (cart[0].quantity === 0) {
                    let newCart = await db.deleteFromCart({id: +id})
                    id = req.session.user.id
                    let updatedCart = await db.getCart([+id])
                    return res.send(updatedCart)
                }


            id = req.session.user.id
            let response = await db.getCart([+id])
            res.send(response)

        } catch(error) {

            console.log('there was an error updating quantity', error)
            
        }

    },

    updateQuantityDropdown: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { id } = req.params
            let { val } = req.body

            let cart = await db.updateQuantityDropdown({ id, val })

            id = req.session.user.id
            let response = await db.getCart([+id])
            res.send(response)

        }
        catch (error) {

            console.log('there was an error updating quantity by drop down menu', error)

        }
    }

}