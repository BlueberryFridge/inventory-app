const express = require('express');
const router = express.Router();
const ItemController = require('../controls/ItemController');
const CategoryController = require('../controls/CategoryController');


/*--------------------FOR CATEGORY CONTROL------------------------*/
// create new category
router.get('/category/create', CategoryController.category_create_get);
router.post('/category/create', CategoryController.category_create_post);

// delete category
router.get('/category/:id/delete', CategoryController.category_delete_get);
router.post('/category/:id/delete', CategoryController.category_delete_post);

// update category
router.get('/category/:id/update', CategoryController.category_update_get);
router.post('/category/:id/update', CategoryController.category_update_post);

// get list of items for one category
router.get('/category/:id', CategoryController.category_items);

// get list of categories
router.get('/category', CategoryController.category);



/*----------------------FOR ITEM CONTROL--------------------------*/
// create new item
router.get('/create', ItemController.item_create_get);
router.post('/create', ItemController.item_create_post);

// delete item
router.get('/:id/delete', ItemController.item_delete_get);
router.post('/:id/delete', ItemController.item_delete_post);

// update item
router.get('/:id/update', ItemController.item_update_get);
router.post('/:id/update', ItemController.item_update_post);

// get item details
router.get('/:d', ItemController.item_details);

// get list of items
router.get('/', ItemController.index);



module.exports = router;