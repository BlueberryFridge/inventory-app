const express = require('express');
const Items = require('../models/items');

// items list
exports.index = (req, res, next) => {
    res.render('index', { title: 'Items List' });
}

// item details 
exports.item_details = (req, res, next) => {
    res.send('Item details not implemented');
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