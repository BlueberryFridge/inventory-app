const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, maxlength: 100, minlength: 1, required: true},
    description: {type: String, maxlength: 500, minlength: 1, required: true}
});

CategorySchema.virtual('url')
              .get(function() {
                  return `/inventory/category/${this._id}`;
              });

module.exports = mongoose.model('Category', CategorySchema);