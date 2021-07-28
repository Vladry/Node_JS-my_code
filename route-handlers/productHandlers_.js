const Product = require('../models/product');

// app.get('/product/:productId', getProduct_);
// app.put('/product/:productId', modifyProduct_);
// app.delete('/product/:productId', deleteProduct_);

exports.createProduct_ = async (req, res) => {
    const {name, price, description} = req.body;
    const product = new Product({name, price, description});
    await product.save();
    res.status(200).send(product).end();
};

exports.getAllProducts_ = async (req, res) => {
    res.send(Product.find().exec()).end();
};

exports.updateProductById_ = async (req, res) => {
    const {name, price, description} = req.body;
    const {productId} = req.params;
    const currentProduct = await Product.findOne(productId).exec();
    if (!currentProduct) {
        res
            .status(404)
            .send({"message": `product with ID= ${productId} not found`})
            .end();
    } else {
        const bodyKeys = {name, price, description};
        const isKey = bodyKeys.filter( key => req.body[key]);
        const objforUpdate = isKey.reduce( (acc, key)=> ({...acc, key: req.body[key]}) , [{}]);
        await Product.findOne(productId).update(objforUpdate).exec();
        res.status(201).send({"message": `product ${productId}'s been updated`}).end();
    }
};

exports.deleteProduct_ = async (req, res) => {
    const {productId} = req.body.params;
    const product = await Product.findOne(productId).exec();
    if(!product) {
        res.status(404).send({"message":`no such product ID: ${productId}`}).end();
    }
    await Product.findOneAndDelete(productId).exec();

};

exports.getProductById_ = async (req, res) => {
    const {productId} = req.body.params;
    const product = await Product.findOne(productId).exec();
    if (!product){
        res.status(404).send({"message": `product ID: ${productId} not found`}).end();
    } else {
        res.status(200).send(product).end();
    }
};

// я просто вставил код- потом желательно самому переписать всё создание юзера:
exports.createUser_ = async (req, res) => {
    const {username, firstName, lastName, password} = req.body;

    const existUser = await User.findOne({username}).exec();

    if (existUser) {
        res.status(400).send({message: 'Username already existed'}).end();
    }

    const user = new User({username, firstName, lastName, password});

    await user.save();

    res.send({message: `User with username ${user.username} created!`}).end();
};