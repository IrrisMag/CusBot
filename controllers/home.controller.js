
import fs from 'fs/promises';

export const showHome = async (req, res) => {
  try {

    res.render('index', { title: 'CusBot'}); 
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


export const handleChatbotQuery = async (req, res) => {
  try {
    // Read FAQs from the JSON file
    const faqsData = await fs.readFile('faqs.json', 'utf8');
    const faqs = JSON.parse(faqsData).faqs;

    // Extract message and language from the request body
    const { message, language = 'en' } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Validate language (optional)
    const supportedLanguages = ['en', 'es', 'fr']; // Add supported languages
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // Convert the query to lowercase and split into words
    const query = message.toLowerCase();
    const queryWords = query.split(' ');

    // Find a matching FAQ
    const faq = faqs.find((f) => {
      const question = f.question[language].toLowerCase();
      // Check if any word in the query matches the FAQ question
      return queryWords.some((word) => question.includes(word));
    });

    // Respond with the answer or a default message
    let response;
    if (query.includes('hello') || query.includes('hi')) {
      response = {
        en: "Hello! How can I assist you today?",
        es: "¡Hola! ¿En qué puedo ayudarte hoy?",
        fr: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      }[language];
    } else if (faq) {
      response = faq.answer[language];
    } else {
      response = {
        en: "Sorry, I couldn't find an answer to your question.",
        es: "Lo siento, no pude encontrar una respuesta a tu pregunta.",
        fr: "Désolé, je n'ai pas trouvé de réponse à votre question.",
      }[language];
    }

    res.json({ response });
  } catch (error) {
    console.error('Error handling chatbot query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};