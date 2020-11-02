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
        categoryX: callback => Category.findById(req.params.id).exec(callback),
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
        res.render('items_list', { title: results.categoryX.name, items_list: results.items_list, sortVal: 'name', displayCategory: false, catId: results.categoryX._id, catDesc: results.categoryX.description });
    });
}

// items list by category POST
exports.category_items_post = (req, res, next) => {
    async.parallel({
        categoryX: callback => Category.findById(req.params.id).exec(callback),
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
            if(sortVal==='name') {
                const textA = a.name.toUpperCase();
                const textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
            return a[sortVal]-b[sortVal];
        });
        res.render('items_list', { title: results.categoryX.name, items_list: results.items_list, sortVal, displayCategory: false, catId: results.categoryX._id, catDesc: results.categoryX.description });
    });
}

// create category GET
exports.category_create_get = (req, res, next) => {
    res.render('category_form', {title: 'Create Category'});
}

// create category POST
exports.category_create_post = (req, res, next) => {
    body('catName', 'Name must not be empty.').isLength({min: 1}).trim().escape();
    body('catDesc', 'Description must not be empty').isLength({min: 1}).trim().escape();
    const errors = validationResult(req);
    const newCat = new Category({
        name: req.body.catName,
        description: req.body.catDesc
    });
    if(!errors.isEmpty()) {
        res.render('category_form', {title: 'Create Category', name: req.body.catName, description: req.body.catDesc, errors: errors.array() });
        return;
    }
    else {
        newCat.save(err => {
            if(err) next(err);
            res.redirect(newCat.url);
        });
    }
}

// delete category GET
exports.category_delete_get = (req, res, next) => {
    async.parallel({
        items_count: callback => Items.countDocuments({category: req.params.id}, callback),
        items_list: callback => Items.find({category: req.params.id}).exec(callback),
        categoryX: callback => Category.findById(req.params.id).exec(callback)
    }, (err, results) => {
        if(err) {
            const err = new Error('Category not found')
            err.status = 404;
            return next(err);
        }
        if(results.items_count) res.render('items_list', { title: results.categoryX.name, 
                                                           items_list: results.items_list, 
                                                           sortVal: 'name', 
                                                           displayCategory: false, 
                                                           catId: results.categoryX._id, 
                                                           errMess: 'List in this category must be empty before you can delete it.' });
        else {
            Category.findByIdAndRemove(results.categoryX._id, err => {
                if(err) next(err);
                res.redirect('/inventory/category');
            })
        }
    });
}

// update category GET
exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id).exec((err, results) => {
        if(err) next(err);
        res.render('category_form', {title: 'Update Category', catName: results.name, catDesc: results.description});
    });
}

// update category POST
exports.category_update_post = (req, res, next) => {
    body('catName', 'Name must not be empty').isLength({min: 1}).trim().escape();
    body('catDesc', 'Description must not be empty').isLength({min: 1}).trim();
    const errors = validationResult(req);
    const categoryX = new Category({
        _id: req.params.id,
        name: req.body.catName,
        description: req.body.catDesc
    });

    if(!errors.isEmpty()) {
        res.render('category_form', {title: 'Update Category', name: req.body.catName, description: req.body.catDesc, errors: errors.array() });
    }
    else {
        Category.findByIdAndUpdate(req.params.id, categoryX, {}, (err, updatedCat) => {
            if(err) next(err);
            res.redirect(updatedCat.url);
        });
    }
}