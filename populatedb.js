console.log('This is a script that populates the inventory-app database.');

// get arguments passed on CLI
const userArgs = process.argv.slice(2);

/*
if(!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return;
}
*/

const async = require('async');
const Category = require('./models/category');
const Items = require('./models/items');

const mongoose = require('mongoose');
const category = require('./models/category');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('Error', console.error.bind(console, 'MongoDB connection error:'));

let items = [];
let categories =[];

const categoryCreate = (name, description, cb) => {
    const category = new Category({name, description});
    category.save(err => {
        if(err) {
            cb(err, null);
            return;
        }
        console.log(`new category: ${category}`);
        categories.push(category);
        cb(null, category);
    });
}

const itemCreate = (name, description, category, price, number_in_stock, cb) => {
    const item = new Items({ name, 
                             description, 
                             category, 
                             price,
                             number_in_stock });
    item.save(err => {
        if(err) {
            cb(err, null);
            return;
        }
        console.log(`new item: ${item}`);
        items.push(item);
        cb(null, item);
    });
}

const createCategories = cb => {
    async.series([
        callback => categoryCreate('')
    ]);
}