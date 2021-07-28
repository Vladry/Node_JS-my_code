// Установка webSocket-ов:  1) npm install ws   2) npm install --save-optional utf-8-validate

/*** WEB Socket Code ***/
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({port: 8080});
let wsClients = [];
/*** end of WEB Socket Code ***/

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('./models/user');
const {createOrder} = require("./route-handlers/order-handlers");

const {
    createProduct,
    getProductList,
    deleteProductById,
    updateProductById,
    getProductById
} = require('./route-handlers/product-handlers');

dotenv.config();
const port = process.env.APP_PORT;
const connectionString = process.env.CONNECTION_STRING;

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
    const {username, firstName, lastName, password} = req.body;
    const existUser = await User.findOne({username}).exec();
    if (existUser) {
        res.status(400).send({message: 'Username already existed'}).end();
    }
    const user = new User({username, firstName, lastName, password});
    await user.save();

    /*** WEB Socket Code ***/
    wsClients.forEach(ws => {
        ws.send(JSON.stringify(user));  //отправка по WEB-Sockets уведомления о залогинивании пользователя
    });
    res.send({message: `User with username ${user.username} created!`}).end();
});
/*** end of WEB Socket Code ***/

app.use('/', async (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const first = Buffer.from(b64auth, 'base64');
    const second = first.toString();
    const third = second.split(':');
    const username = third[0];
    const password = third[1];

    const user = await User.findOne({username}).exec();
    console.log(user);

    const userNotFound = !user;
    const passwordsNotMatch = user && user.password !== password;
    if (userNotFound || passwordsNotMatch) {
        res.status(401).send({
            message: userNotFound ? 'User not found!' : 'Passwords not match!',
        });

        return;
    }

    req.user = user;
    next();
});

app.get('/products/:productId', getProductById);
app.get('/products', getProductList);
app.post('/products', createProduct);
app.post('/orders', createOrder);
app.put('/products/:productId', updateProductById);
app.delete('/products/:productId', deleteProductById);

app.get('/login', (req, res) => {
    wsClients.forEach(ws => {
        ws.send(JSON.stringify(req.user));  //отправка по WEB-Sockets уведомления о залогинивании пользователя
    });
    res.send(req.user).end();
});

mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
    })
    .then(async () => {
        app.listen(port, () => {
            console.log(`App start listen on ${port}`);
        });
    });


/*** ЗАПУСК WEB-Sockets ***/
/*** WEB Socket Code ***/
wsServer.on('connection', (wsClientScope) => {
    console.log('New User');

    wsClients.push(wsClientScope);
    wsClientScope.send('Hello');
    wsClientScope.on('close', () => console.log('Пользователь отключился'));
});
/*** end of Server WEB Socket Code ***/


/***КОД ДЛЯ ФРОНТЕНДА -вставить и запустить его в консоль многих окон браузера (по F12) ***/
// const myWs = new WebSocket('ws://localhost:8080');
//
// myWs.onopen = function () {  // обработчик проинформирует в консоль, когда соединение установится
//     console.log('подключился');
// };
// myWs.onmessage = function (message) { // обработчик сообщений от сервера
//     console.log('Message: %s', message.data);
// };
