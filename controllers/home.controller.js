const Product = require('../lib/models/product.model.js'); // Assuming you have a Product model

exports.showHome = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.render('pages/home', { title: 'Customers', products }); // Pass products to the template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
