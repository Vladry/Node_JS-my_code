const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.APP_PORT;
const connectionString = process.env.CONNECTION_STRING;
const app = express();
app.use(express.json());
const {createUser_} = require('./route-handlers/product-handlers');
const User = require('./models/user');
const {
    createProduct_,
    getAllProducts_,
    updateProductById_,
    deleteProduct_,
    getProductById_,
} = require('./route-handlers/productHandlers_');

app.post('/users', createUser_);




mongoose.connect(connectionString, {useNewUrlParser: true}).then(async () => {
        app.listen(port, () => {
                console.log(`server listening on port ${port}`)
            }
        );
    }
)
    .catch(err => {
        console.log(`could not connect to server port ${port}`, err.message);
        process.exit();
    });



app.post('/users', async (req, res) => {
    const {firstName, lastName, username, password} = req.body;
    const userExists = await User.findOne({username}).exec();
    if (userExists) {
        res.status(400).send({"message": `user ${username} already exists`}).end();
    } else {
        const newUserData = {
            firstName,
            lastName,
            username,
            password,
        };
        const newUser = new User(newUserData);
        await newUser.save();
        res.state(201).send({"message": `user ${username}'s been created`}).end();
    }
});