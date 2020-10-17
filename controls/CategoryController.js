const express = require('express');
const async = require('async');
const Category = require('../models/category');
const Items = require('../models/items');
const { body, validationResult } = require('express-validator');


// categories list 
exports.category = (req, res, next) => {
    Category.find({}, (err, categories_list) => {
        if(err) return next(err);
        categories_list.sort((a, b) => 
            (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0);
        res.render('categories_list', { title: 'Categories List', categories_list });
    });
}

// items list by category GET
exports.category_items_get = (req, res, next) => {
    async.parallel({
        categoryX: callback => Category.findById(req.params.id, 'name').exec(callback),
        items_list: callback => Items.find({ category: req.params.id }).exec(callback)
    }, (err, results) => {
        if(err) return next(err);
        if(results.categoryX===null) {
            const err = new Error('Category not found. D:');
            err.status = 404;
            return next(err);
        }
        results.items_list.sort((a, b) => {
            return (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0;
        });
        res.render('items_list', { title: results.categoryX.name, items_list: results.items_list, sortVal: 'name', displayCategory: false });
    });
}

// items list by category POST
exports.category_items_post = (req, res, next) => {
    async.parallel({
        categoryX: callback => Category.findById(req.params.id, 'name').exec(callback),
        items_list: callback => Items.find({ category: req.params.id }).exec(callback)
    }, (err, results) => {
        if(err) return next(err);
        if(results.categoryX===null) {
            const err = new Error('Category not found. D:');
            err.status = 404;
            return next(err);
        }
        const sortVal = req.body.sortby;
        results.items_list.sort((a, b) => {
            if(sortVal==='price' || sortVal==='stock') return a[sortVal]-b[sortVal];
            else{
                const textA = a.name.toUpperCase();
                const textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;}
        });
        res.render('items_list', { title: results.categoryX.name, items_list: results.items_list, sortVal, displayCategory: false});
    });
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