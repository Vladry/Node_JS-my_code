const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    const {price, name, description} = req.body;
    const existProduct = await Product.findOne({name}).exec();
    if(existProduct) {
        res.status(400).send({"message": `товар ${name} уже существует`}).end();
        return;
    }
    const product = new Product({price, name, description});
    await product.save();

    res.send(product).end();
};

exports.getProductList = async (req, res) => {
    const products = await Product.find().exec();

    res.send(products).end();
};

exports.deleteProductById = async (req, res) => {
    const {productId} = req.params;

    const product = await Product.findById(productId).exec();

    if (!product) {
        res
            .status(404)
            .send({message: `Product with id ${productId} not found!`})
            .end();
    }

    await Product.findByIdAndDelete(productId);

    res.send({
        message: `Product with id ${productId} and ${product.name} deleted!`,
    });
};

//////////////////////////////////////////////////////
exports.updateProductById = async (req, res) => {
    const {productId} = req.params;
    const bodyKeys = ['name', 'price', 'description'];
    const product = await Product.findById(productId).exec();
    if (!product) {
        res
            .status(404)
            .send({message: `Product with id ${productId} not found!`})
            .end();
    }
    const objectForUpdate = bodyKeys
        .filter((key) => req.body[key])
        .reduce((acc, el) => ({...acc, el: req.body[el]}), {});
    await Product.findById(productId).update(objectForUpdate).exec();
    res.send({message: `Product with id ${productId} updated!`}).end();
};

exports.getProductById = async (req, res) => {
    const {productId} = req.params;
    const product = await Product.findById(productId).exec();
    res.send(product).end();
};