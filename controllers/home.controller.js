import Product from '../lib/models/product.model.js';

export const showHome = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.render('pages/home', { title: 'Customers', products }); // Pass products to the template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const showBot = async (req, res) => {

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
  };

export const responseBot= async (req, res) => {
  const userMessage = req.body.message;

  // Example: Responding based on user input
  let botResponse = '';
  if (userMessage.toLowerCase().includes('track')) {
    botResponse = 'You can track your order through the "Track Order" section.';
  } else if (userMessage.toLowerCase().includes('account')) {
    botResponse = 'For account-related inquiries, please visit the "Account Info" section.';
  } else if (userMessage.toLowerCase().includes('order')) {
    botResponse = 'I can help you track your order. Please provide the order ID.';
  } else {
    botResponse = 'I am here to assist you. How can I help?';
  }
  //res.json({ response: 'This is a response from the server' });
  res.json({ response: botResponse });
};

