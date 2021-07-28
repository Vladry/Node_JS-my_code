const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
    const {products} = req.body;
    let total = 0;

    await Promise.all(products.map(async (item) => {
        const productName = item.productName;
        const productItem = await Product.findOne({name:productName}).exec();
        total += productItem.price * item.quantity;
    }));
    console.log(total);
    const newOrder = new Order({username:req.user.username, products, total, isPaid:false});
    await newOrder.save();
    res.status(201).send(`new order's been created`).end();


};


exports.retrieveOrder = async (req, res) => {
    const {username, products, total, isPaid, deliveryInformation} = req.body;
    const {orderId} = req.body.params;

};
exports.updateOrder = async (req, res) => {
    const {username, products, total, isPaid, deliveryInformation} = req.body;
    const {orderId} = req.body.params;

};
exports.deleteOrder = async (req, res) => {
    const {username, products, total, isPaid, deliveryInformation} = req.body;
    const {orderId} = req.body.params;

};