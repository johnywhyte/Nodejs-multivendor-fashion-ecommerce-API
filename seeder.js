const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Store = require('./models/Store');
const Product = require('./models/Product');


// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const stores = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/stores.json`, 'utf-8')
);

// Read JSON files
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Store.create(stores);
    await Product.create(products);
  
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Store.deleteMany();
    await Product.deleteMany();
   
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
