const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Product = require('../models/Product');
const Store = require('../models/Store');


// @desc Get all Products
// @route GET/api/v1/products
// @route GET /api/v1/stores/:storeId/Products
// @access Public

exports.getProducts = asyncHandler( async (req, res, next) => {

    let query;

    if(req.params.storeId) {
        query = Product.find({store: req.params.storeId})      
    }else{
        query = Product.find().populate({
            path: 'store',
            select: 'name description'
        })
    }

    const products = await query;

    res.status(200)
    .json({
        success: true,
        count: products.length,
        data: products
    });
});


// @desc Get a single Products
// @route GET /api/v1/products/:id
// @access Public

exports.getProduct = asyncHandler( async (req, res, next) => {

const product = await Product.findById(req.params.id).populate({
    path: 'store',
    select: 'name description'
})

if(!product)
{
    return next(
        new ErrorResponse(`No product with the id of ${req.params.id}`), 404)
}

    res.status(200)
    .json({
        success: true,
        data: product
    });
})



// @desc Add a Products
// @route POST /api/v1/stores/:storeid/products
// @access Private

exports.addProduct = asyncHandler( async (req, res, next) => {
    req.body.store = req.params.storeId

    const store = await Store.findById(req.params.storeId)
    
    if(!store)
    {
        return next(
            new ErrorResponse(`No store with the id of ${req.params.storeId}`), 404)
    }


    const product = await Product.create(req.body);
    
        res.status(200)
        .json({
            success: true,
            data: product
        });
    })



// @desc Update Products
// @route PUT /api/v1/stores/:storeid/products
// @access Private

exports.updateProduct = asyncHandler( async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    
    if(!product)
    {
        return next(
            new ErrorResponse(`No product with the id of ${req.params.id}`), 404)
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    
        res.status(200)
        .json({
            success: true,
            data: product
        });
    })


// @desc Delete a Product
// @route DELETE /api/v1/products/:id
// @access Private

exports.deleteProduct = asyncHandler( async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    
    if(!product)
    {
        return next(
            new ErrorResponse(`No product with the id of ${req.params.id}`), 404)
    }

await product.remove()
    
        res.status(200)
        .json({
            success: true,
            data: {}
        });
    })