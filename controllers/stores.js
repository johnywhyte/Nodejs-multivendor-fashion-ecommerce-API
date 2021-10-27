const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Store = require('../models/Store');

// @desc Gelt all Store
// @route Get /api/v1/bootcamps
// @access Public
exports.getStores = asyncHandler (async (req, res, next) => {
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeField and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    console.log(reqQuery)

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators (gt,gte)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //finding resource
    query = Store.find(JSON.parse(queryStr)).populate('products')

    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');

       query = query.select(fields)
    }

        //sort 
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');

       query = query.sort(sortBy)
    }else{
       query = query.sort('-createdAt')

    }


  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Store.countDocuments();

query = query.skip(startIndex).limit(limit);

//pagination
const pagination = {}

if(endIndex < total) {
    pagination.next = {
        page: page + 1,
        limit
    }
}

if(startIndex > 0){
    pagination.prev = {
        page: page - 1,
        limit
    }
}

    //executing our query
        const stores = await query;
        res.status(200)
        .json({
            status: true,
            count: stores.length,
            pagination,
            data: stores
        })
   

});

// @desc Get a single store
// @route Get /api/v1/store/:id
// @access Public
exports.getStore = asyncHandler (async (req, res, next) => {
  
        const store = await Store.findById(req.params.id);

        if(!store) {
            return  next(new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404));

        }

        res.status(200)
        .json({
            status: true, 
            data: store})

   
});

// @desc create a store
// @route post /api/v1/stores/
// @access Private
exports.createStore = asyncHandler (async (req, res, next) => {
 
        const store = await Store.create(req.body);
        res.status(201)
        .json({
            status: true, 
            data: store
        })
  
   
});

// @desc Update a store
// @route PUT /api/v1/stores/:id
// @access Private
exports.updateStore = asyncHandler (async (req, res, next) => {
    
        const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!store) {
            return  next(new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404));
        }

        res.status(200)
        .json({status: true, data: store})
   
});

// @desc delete a store
// @route PUT /api/v1/stores/:id
// @access Private
exports.deleteStore = asyncHandler (async (req, res, next) => {
  
      const store = await Store.findByIdAndDelete(req.params.id)

      if(!store) {
        return  next(new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404));
    }
    
      res.status(200)
      .json({
          status: true,
          data: {}
      })
 
});



// @desc store within a radius
// @route PUT /api/v1/stores/store/radius/:zipcode/:distance
// @access Private
exports.getStoresInRadius = asyncHandler (async (req, res, next) => {
  
   const {zipcode, distance} = req.params;

   //get the latitude and logitude
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;


   //calc radius using radians
    //divide distance by radius of the earth 3,963mi / 6,378km

    const radius = distance / 3963;

    const stores = await Store.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })


  res.status(200).json({
    success: true,
    count: stores.length,
    data: stores
  });

});
