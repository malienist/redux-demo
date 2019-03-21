const express = require('express');
const productRoutes = express.Router();
const productModel = require('../models/product.model');

//fetch products
productRoutes.route('/getproducts').get((req, res) => {
    console.log(`request received`);
    productModel.find({}, (err, data) => {
        if(err) console.log(`error fetching products - ${err}`);
        else {
            // console.log(`data returned - ${data}`);
            res.status(200).send(data);
        }
    })
    .catch(err => console.log(`error fetching products - ${err}`));
});

//delete product
productRoutes.route('/deleteproduct').delete((req, res) => {
    let queryId = req.query.id;
    console.log(`id to delete - ${queryId}`);
    productModel.deleteOne({id: queryId}, (err, data) => {
        if(err) console.log(`product not found - ${err}`);
        else {
            console.log(`deletion response - ${data}`);
            res.status(200).send();
        }
    })
    .catch(err => console.log(`error caught while deleting product - ${err}`));
});

//update quantity
productRoutes.route('/updatequantity').put((req, res) => {
    let _prodId = req.query.id;
    let _quantity = req.query.quantity - 1;
    console.log(`quantity to update after decrement - ${_quantity}`);
    productModel.findOneAndUpdate({"id": _prodId}, {$set: {"quantity": _quantity}}, (err, data) => {
        if(err) console.log(`error while updating document`);
        else res.status(200).send(data);
    })
    .catch(err => console.log(`error caught while updating product quantity - ${err}`));
});

module.exports = productRoutes;