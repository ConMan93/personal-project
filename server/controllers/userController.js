module.exports = {

    updateUsername: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { username, id } = req.body

            if (username.length <= 3) {
                return res.status(409).send('Username must be 4 or more characters long.')
            }

            let response = await db.updateUsername({username, id})
            let updatedUsername = response[0]
            delete updatedUsername.hash

            req.session.user = {...req.session.user, ...updatedUsername}
            return res.send(req.session.user)

        }
        catch (error) {

            return res.status(500).send(error)

        }

    },

    updateUserImage: async (req, res) => {

        try {

            let db = req.app.get('db')
            let { uploadedImage, id } = req.body

            let response = await db.updateUserImage({ uploadedImage, id })
            let updatedImage = response[0]
            // delete updatedImage

            req.session.user = {...req.session.user, ...updatedImage}
            return res.send(req.session.user)
            
        }
        catch (error) {

            return res.status(500).send(error)

        }
    }

}