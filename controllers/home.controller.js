
//import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from'path';


export const showHome = async (req, res) => {
  try {

    res.render('index', { title: 'CusBot'}); 
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fetchFaqs =  async (req, res) => {
  try {
    // Get the language from the query parameter (default to 'en')
    const language = req.query.language || 'en';

    // Path to the FAQs JSON file
    const faqsFilePath = path.join(__dirname, '..', 'faqs.json');

    // Read the JSON file asynchronously using fs.promises.readFile
    const data = await fs.readFile(faqsFilePath, 'utf8');
    
    // Parse the JSON data
    let faqs;
    try {
      const parsedData = JSON.parse(data);
      faqs = parsedData.faqs.map(faq => ({
        question: faq.question[language] || faq.question['en'], // Default to 'en' if the language is not found
        answer: faq.answer[language] || faq.answer['en'] // Default to 'en' if the language is not found
      }));
    } catch (parseError) {
      console.error('Error parsing FAQs data:', parseError);
      return res.status(500).json({ error: 'Failed to parse FAQs data' });
    }

    // Send the FAQs as a JSON response
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const handleChatbotQuery = async (req, res) => {
  try {
    
    const faqsData = await fs.readFile('faqs.json', 'utf8');
    const faqs = JSON.parse(faqsData).faqs;

    // Extract message and language from the request body
    const { message, language = 'en' } = req.body;

    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    
    const supportedLanguages = ['en', 'es', 'fr']; 
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