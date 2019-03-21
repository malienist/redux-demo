const express = require('express');
const app = express();
const businessRoutes = express.Router();

//require business model in our routes module
let Business = require('../models/business');

//defined store route
businessRoutes.route('/add').post((req, res) => {
    // console.log('business.route.js - adding business');
    let business = new Business(req.body);
    business.save()
    .then(business => {
        res.status(200).json({'business': 'business in added successfully'});
    })
    .catch(err => {
        res.status(400).send('unable to save to db');
    })
});

//defined get datea (index ot listing) route
businessRoutes.route('/').get((req, res) => {
    Business.find((err, businesses) => {
        if(err){
            console.log(err);
        } else {
            res.json(businesses);
        }
    });
});

businessRoutes.route('/edit/:id').get((req, res) => {
    Business.findById(req.params.id, (err, next, business) => {
        if(!business){
            return next(new Error('couldnot load document'));
        } else {
            business.person_name = req.body.person_name;
            business.business_name = req.body.business_name;
            business.business_gst_number = req.body.business_gst_number;

            business.save().then(business => {
                res.json('update complete');
            })
            .catch(err => {
                res.status(400).send('unable to update db');
            });
        }
    });
});

businessRoutes.route('/delete/:id').get((req, res) => {
    Business.findByIdAndRemove({_id: req.params.id}, (err, business) => {
        if(err) res.json(err);
        else res.json('successfully removed');
    });
});

module.exports = businessRoutes;