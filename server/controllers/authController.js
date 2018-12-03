const bcrypt = require('bcryptjs');

module.exports = {

    register: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { username, email, password, confirmPassword } = req.body

            if ( username.length <= 3) {
                return res.status(409).send('Username must be 4 or more characters long.')
            }

            if (!email.includes('@') || !email.includes('.')) {
                return res.status(409).send('Email must be in format "youremail@email.com/net/etc."')
            }

            if (password.length < 5) {
                return res.status(409).send('Password must be at least 5 characters long.')
            }

            if (password !== confirmPassword) {
                return res.status(409).send('Passwords must match.')
            }

            let userResponse = await db.getUserByEmail(email)

            if (userResponse[0]) {
                return res.status(409).send('Email already taken.')
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            let response = await db.registerUser({ username, email, hash })
            let newUser = response[0]

            delete newUser.hash
            req.session.user = newUser
            res.send(newUser)

        } catch(error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    login: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { email, password } = req.body

            let userResponse = await db.getUserByEmail(email)
            let user = userResponse[0]

            if (!user) {
                return res.status(401).send('Email not found, please register for an account before logging in.')
            }


            let isAuthenticated = bcrypt.compareSync(password, user.hash)

            if (!isAuthenticated) {
                return res.status(403).send('Incorrect password.')
            }
            delete user.hash
            req.session.user = user
            let hasCart = await db.getCart([req.session.user.id])
            if (hasCart[0]) {
                req.session.user.cart_id = hasCart[0].cart_id
            } 
            res.send(req.session.user)

        } catch(error) {

            console.log(error)
            res.status(500).send(error)
            
        }

    },

    logout: (req, res) => {

        req.session.destroy()
        return res.sendStatus(200)

    },

    getCurrentUser: (req, res) => {

        res.send(req.session.user)

    }
        
}