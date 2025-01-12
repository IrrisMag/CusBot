const Product = require('../lib/models/product.model.js');

const showHome = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.render('pages/home', { title: 'Customers', products }); // Pass products to the template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const showBot = async (req, res) => {

    const chatHistory = []; // Initialize empty or fetch from a database
    const faqs = [
        { question: 'How do I track my order?', answer: 'You can track your order by clicking on "Track Order" button above.' },
        { question: 'How do I reset my password?', answer: 'Click on "Account Info" and then select "Reset Password".' },
    ]; // Fetch FAQs from a database or static list
    const languages = [
        { code: 'en', name: 'English', selected: true },
        { code: 'es', name: 'Spanish', selected: false },
        { code: 'fr', name: 'French', selected: false },
    ];

    res.render('pages/bot', { title: 'Chat Support', chatHistory, faqs, languages });
  }

module.exports = {
    showHome,
    showBot,
  };
