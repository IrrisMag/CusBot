const express = require('express');
const router = express.Router();



const { showHome } = require('../controllers/home.controller');

router.get('/', showHome);
// In your Express app setup

router.get('/bot', (req, res) => {
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
});



module.exports = router;