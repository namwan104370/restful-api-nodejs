require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')

const app = express();

app.use(express.json());

// Register 
app.post("/register", async (req, res) => {
    // our register logic goes here

    try {
        //Get user input
        const { name , email , password , active} = req.body

        // Validate user input 
        if (!(name && email && password && active)){
            res.status(400).send("All input is required");
        }
        
        // Check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});
        console.log("oldUser",oldUser);
        if (oldUser) {
            return res.status(409).send("User already exist. Please login")
        }
        
        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10 );

        // Create user in our database
        const user = await User.create({
            name : name,
            // email: email.toLowerCase(),
            email: email,
            password: encryptedPassword,
            active : active
        })

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )

        // save user token 
        user.token = token;

        // return new user
        res.status(201).json(user);

    } catch (err) {
        console.log(err);
    }

})

// Login goes here 
app.post("/login", async (req, res) => {
    // our login logic goes here
    try {

        const { email, password } = req.body;
        if(!(email && password)){
            res.status(400).send("All input is required");
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password) )) {
            const token = jwt.sign(
                { user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            // save user token
            user.token = token;
            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid Credentials");
        }
        
        
        

    } catch(err) {
        console.log(err);
    }
})

app.post('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome ...');
})

module.exports = app;