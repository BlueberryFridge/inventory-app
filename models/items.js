const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, minlength: 1, maxLength: 100, required: true},
    description: {type: String, minlength: 1, maxlength: 500, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true},
    number_in_stock: {type: Number, required: true}
});

ItemSchema.virtual('url')
          .get(function() {
              return `/inventory/${this._id}`;
          });

module.exports = mongoose.model('Items', ItemSchema);