const express = require('express');
const Category = require('../models/category');


// categories list 
exports.category = (req, res, next) => {
    res.send('Category page not implemented');
}

// items list by category
exports.category_items = (req, res, next) => {
    res.send('Items list for category not implemented');
}

// create category GET
exports.category_create_get = (req, res, next) => {
    res.send('Create category GET not implemented');
}

// create category POST
exports.category_create_post = (req, res, next) => {
    res.send('Create category POST not implemented');
}

// delete category GET
exports.category_delete_get = (req, res, next) => {
    res.send('Delete category GET not implemented');
}

// delete category POST
exports.category_delete_post = (req, res, next) => {
    res.send('Delete category POST not implemented');
}

// update category GET
exports.category_update_get = (req, res, next) => {
    res.send('Update category GET not implemented');
}

// update category POST
exports.category_update_post = (req, res, next) => {
    res.send('Update category POST not implemented');
}