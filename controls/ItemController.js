const express = require('express');
const items = require('../models/items');
const Items = require('../models/items');

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
             res.render('items_list', { title: 'Items List', items_list, sortVal: 'name' });
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
                res.render('items_list', { title: 'Items List', items_list, sortVal });
            }
         });
}

// item details 
exports.item_details = (req, res, next) => {
    Items.findById(req.params.id)
         .populate('category')
         .exec((err, item_found) => {
             if(err) return next(err);
             res.render('item_details', { title: item_found.name, item_details: item_found });
         });
}

// create item GET
exports.item_create_get = (req, res, next) => {
    res.send('Create item GET not implemented');
}

// create item POST
exports.item_create_post = (req, res, next) => {
    res.send('Create item POST not implemented');
}

// delete item GET
exports.item_delete_get = (req, res, next) => {
    res.send('Delete item GET not implemented');
}

// delete item POST
exports.item_delete_post = (req, res, next) => {
    res.send('Delete item POST not implemented');
}

// update item GET
exports.item_update_get = (req, res, next) => {
    res.send('Update item GET not implemented');
}

// update item POST
exports.item_update_post = (req, res, next) => {
    res.send('Update item POST not implemented');
}