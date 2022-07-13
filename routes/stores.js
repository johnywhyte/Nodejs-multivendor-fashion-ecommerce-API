const express = require('express');

const { getStores, 
    getStore, 
    createStore, 
    updateStore, 
    deleteStore, 
    getStoresInRadius,
    storePhotoUpload
    } = require('../controllers/stores')

//include other resource router
const productRouter = require('./products')

const router = express.Router();

//re-route into other resource router
router.use('/:storeId/products', productRouter)

router.route('/radius/:zipcode/:distance').get(getStoresInRadius);

router.route('/:id/photo').put(storePhotoUpload);


router.route('/')
.get(getStores)
.post(createStore)

router.route('/:id')
.get(getStore)
.put(updateStore)
.delete(deleteStore)


module.exports = router;
