const express = require('express'), bodyParser = require('body-parser'), 
cors = require('cors'), mongoose = require('mongoose');

//routes
const businessRoute = require('./routes/business.route');
const productRoutes = require('./routes/products.route');

//db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/reduxdb', { useNewUrlParser: true }).then(
    () => { console.log('database is connected') },
    err => { console.log('cant connect to db' + err) }
);
mongoose.set('useFindAndModify', false);

//server
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/business', businessRoute);
app.use('/products', productRoutes);
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('listening to port', port);
});