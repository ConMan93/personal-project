require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const cc = require('./controllers/cartController');
const ac = require('./controllers/authController');
const uc = require('./controllers/userController')
const app = express();

const { SESSION_SECRET, SERVER_PORT, CONNECTION_STRING } = process.env;

app.use(bodyParser.json());
app.use( express.static( `${__dirname}/../build` ) );
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))
app.use(`/s3`, require(`react-s3-uploader/s3router`)({
    bucket: process.env.S3_BUCKET,
    region: process.env.REGION, //optional
    headers: {"Access-Control-Allow-Origin": "*"}, // optional
    ACL: `public-read`, // this is default
    uniquePrefix: true // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
  }));

massive(CONNECTION_STRING).then( db => {
    app.set('db', db)
    console.log('database is connected')
})

// Auth
app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)
app.get('/auth/currentuser', ac.getCurrentUser)

// Cart
app.get('/api/cart', cc.getCart)
app.post('/api/cart', cc.addToCart)
app.put('/api/cart/:id', cc.updateQuantity)
app.delete('/api/cart/:id', cc.deleteFromCart)

// User
app.put('/api/updateusername', uc.updateUsername)
app.put('/api/updateimage', uc.updateUserImage)


// Payment
app.post('/charge', async (req, res) => {
    try {
        
        let db = req.app.get('db')
        let { cart_id } = req.session.user
        let total = req.body.amount * 100
        
        let { status } = await stripe.charges.create({
            amount: total,
            currency: "usd",
            description: "An example charge",
            source: req.body.data.token
        });
        if (status === 'succeeded') {
            await db.cartPurchased([cart_id])
        }
        return res.json({ status })

    } catch(error) {
        console.log('error error', error)
        return res.status(500).end()
    }
})

app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})