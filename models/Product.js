const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [10, 'Please add a title']
    },
    description: {
        type: String,
        trim: true,
        required: [10, 'Please add a description']

    },
    img: { 
        type: String, 
        required: true 
    },
    categories: { 
        type: Array,
        required: true 
    },
     size: { 
         type: String 
    },
    color: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: true 
    },
    quantity: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: true,
    },
    status: {
        type: [String],
        required: true,
        enum: [
          'Available',
          'Sold Out',
          'Awaiting Delivery',
        ]
    }

  

})

module.exports = mongoose.model('Product', ProductSchema);