const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;
    //console log the response
    console.log(err.stack.red);
    console.log(err);
    

//Mongoose Bad Object ID
if(err.name === 'CastError'){
    const message = `Store not found with the id of ${err.value}`
    error = new ErrorResponse(message, 404);
}

//Mongoose duplicate field value entered
if(err.code === 11000) {
    const message = 'This Store Name Already Exist';
    error = new ErrorResponse(message, 404)
}

//Mongoose Validation Error
if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400)
}


    res.status(error.statusCode || 500)
    .json({
        status: false,
        error: error.message || 'Server Error'
    })


}

module.exports = errorHandler;