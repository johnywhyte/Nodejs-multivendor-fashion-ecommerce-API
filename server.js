const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errors')
const morgan = require('morgan');
const colors = require('colors')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')


//load env vars
dotenv.config({ path: './config/config.env' });

//connect to db
connectDB();

const app = express();

//Body parser
app.use(express.json());

//bring in the router file
const stores = require('./routes/stores');
const products = require('./routes/products');



// const logger = (req, res, next) => {
//     req.hello = 'hello world';
//     console.log(' middle ware ran')
//     next()
// }

//dev loggin middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
};

// File Uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Router
app.use('/api/v1/stores', stores);
app.use('/api/v1/products', products);

//custom error handler must be place after route is mounted
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//handle unhandled rejection
process.on('unhandledRejection', (err, message) => {
    console.log(`Error: ${err.message}`.red )

    //close server n exit
    server.close(()=> process.exit(1))
});
