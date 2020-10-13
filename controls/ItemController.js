const express = require('express');
const Items = require('../models/items');

// items list GET
exports.index_get = (req, res, next) => {
    Items.find({}, 'name price number_in_stock category')
         .populate('category')
         .exec((err, items_list) => {
            if(err) return next(err);
             res.render('items_list', { title: 'Items List', items_list });
         });
}

// items list POST
exports.index_post = (req, res, next) => {
    Items.find({}, 'name price number_in_stock category')
         .populate('category')
         .exec( (err, items_list) => {
            if(err) return next(err);
            const sortVal = req.body.sortby;
            const new_list = Object.values(items_list);

            new_list.sort((a, b) => {
                return (a[sortVal] < b[sortVal]) ? -1 : (a[sortVal] > b[sortVal]) ? 1 : 0; 
            });
            res.render('items_list', { title: 'Items Sorted', items_list: new_list });
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