const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, minlength: 1, required: true},
    description: {type: String, minlength: 1, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true},
    number_in_stock: {type: Number}
});

ItemSchema.virtual('url')
          .get(function() {
              return `/inventory/${this._id}`;
          });

module.exports = mongoose.model('Items', ItemSchema);