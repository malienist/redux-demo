const mongoose = require('mongoose');

const userSchema = mongoose.Schema;
const userModel = new userSchema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    quantity: {
        type: String,
        required: false
    }
}, {
    collection: 'cartproducts'
});

module.exports = mongoose.model('usermodel', userModel);