const express = require('express');
const async = require('async');
const { body, validationResult } = require('express-validator');

const Items = require('../models/items');
const Category = require('../models/category');

// items list GET
exports.index_get = (req, res, next) => {
    Items.find({}, 'name price number_in_stock category')
         .populate('category')
         .exec((err, items_list) => {
            if(err) return next(err);
            items_list.sort((a, b) => {
                const textA = a.name.toUpperCase();
                const textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
             res.render('items_list', { title: 'Items List', items_list, sortVal: 'name', displayCategory: true });
         });
}

// items list POST
exports.index_post = (req, res, next) => {
    Items.find({}, 'name price number_in_stock category')
         .populate('category')
         .exec( (err, items_list) => {
            if(err) return next(err);
            else {
                const sortVal = req.body.sortby;

                items_list.sort((a, b) => {
                    var textA, textB;
                    if(sortVal === 'name') {
                        textA = a[sortVal].toUpperCase();
                        textB = b[sortVal].toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    }
                    if(sortVal === 'category') {
                        textA= a.category.name.toUpperCase();
                        textB = b.category.name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    }
                    return a[sortVal]-b[sortVal];
                });
                res.render('items_list', { title: 'Items List', items_list, sortVal, displayCategory: true });
            }
         });
}

// item details 
exports.item_details = (req, res, next) => {
    Items.findById(req.params.id)
         .populate('category')
         .exec((err, item_found) => {
             if(err) return next(err);
             if(!item_found) {
                 const err = new Error('Item not found. D:');
                 return next(err);
             }
             res.render('item_details', { title: item_found.name, item_details: item_found });
         });
}

// create item GET
exports.item_create_get = (req, res, next) => {
    Category.find({})
            .exec((err, categories_list) => {
                if(err) return next(err);
                res.render('item_form', { title: 'Create Item', categories_list });
            });
}

// create item POST
exports.item_create_post = [
    // convert category into array
    (req, res, next) => {
        if(!(req.body.category instanceof Array)) {
            if(typeof req.body.category === 'undefined') req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim().escape(),
    body('category.*').escape(),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a number of at least 0.').trim().escape(),
    body('number_in_stock').isInt({ min: 0}).withMessage('Number in stock must be an integer of at least 0.').trim().escape(),
    body('description', 'Description must not be empty.').isLength({min: 1}).trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var selectedCategory = '';
        const newItem = new Items({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            number_in_stock: req.body.number_in_stock,
            description: req.body.description
        });

        if(!errors.isEmpty()) {
            Category.find({})
                    .exec((err, categories_list) => {
                        if(err) return next(err);
                        categories_list.map(category => {
                            if(String(category._id) === String(newItem.category)) selectedCategory = category.name;
                        });
                        res.render('item_form', { title: 'Create Item', categories_list, errors: errors.array(), selectedCategory, newItem });
                    });
            return;
        }
        else {
            newItem.save(err => {
                if(err) next(err);
                res.redirect(newItem.url);
            });
        }
    }
];

// delete item GET
exports.item_delete_get = (req, res, next) => {
    Items.findByIdAndRemove(req.params.id, err => {
        if(err) return next(err);
        res.redirect('/inventory');
    });
}

// update item GET
exports.item_update_get = (req, res, next) => {
    async.parallel({
        itemX: callback => Items.findById(req.params.id).populate('category').exec(callback),
        categories_list: callback => Category.find(callback)
    }, (err, results) => {
        if(err) return next(err);
        if(results.itemX === null) {
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        var selectedCategory;
        results.categories_list.map( categoryX => {
            if(String(categoryX._id) === String(results.itemX.category._id)) selectedCategory = categoryX.name;
        });
        res.render('item_form', { title: 'Update Item', categories_list: results.categories_list, selectedCategory, newItem: results.itemX });
    });
}

// update item POST
exports.item_update_post = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)) {
            if(typeof req.body.category === 'undefined') req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('name', 'Name must not be empty.').isLength({min: 1}).trim().escape(),
    body('category.*').trim().escape(),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a number of at least 0.').trim().escape(),
    body('number_in_stock', 'Number in stock must be an integer of at least 0.').isInt({ min: 0 }).trim().escape(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim().escape(),
    (req, res, next) => {
        var selectedCategory;
        const errors = validationResult(req);
        const itemX = new Items({
            _id: req.params.id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            description: req.body.description
        });
        if(!errors.isEmpty()) {
            Category.find({})
                    .exec((err, results) => {
                        if(err) return next(err);
                        results.map(categoryX => {
                            if(String(categoryX._id) === String(req.body.category)) selectedCategory = categoryX.name;
                        });
                        res.render('item_form', { title: 'Update Item', errors: errors.array(), categories_list: results, newItem: itemX, selectedCategory });
                    });
            return;
        }
        else {
            Items.findByIdAndUpdate(req.params.id, itemX, {}, (err, updatedItem) => {
                if(err) return next(err);
                res.redirect(updatedItem.url);
            });
        }

    }
];