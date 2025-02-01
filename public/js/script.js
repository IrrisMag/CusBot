document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const textbox = document.getElementById('textbox');
    const sendBtn = document.getElementById('sendBtn');
    const escalationOptions = document.getElementById('escalationOptions');
    const emailBtn = document.getElementById('emailBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const supportBtn = document.getElementById('supportBtn');
    const languageSelector = document.getElementById('language');
  
    // Function to add a message to the chat container
    function addMessage(sender, message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `mb-2 ${sender === 'user' ? 'text-end' : 'text-start'}`;
      messageDiv.innerHTML = `
        <span class="d-inline-block p-2 rounded ${sender === 'user' ? 'bg-primary text-white' : 'bg-light'}">
          ${message}
        </span>
      `;
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
    }
  
    // Function to send user message to the backend
    async function sendMessage() {
      const message = textbox.value.trim();
      if (message) {
        addMessage('user', message); // Display user's message in the chat
        textbox.value = ''; // Clear the input field
  
        try {
          // Send the message to the backend
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message,
              language: languageSelector.value, // Include the selected language
            }),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          addMessage('bot', data.response); // Display bot's response in the chat
        } catch (error) {
          console.error('Error sending message:', error);
          addMessage('bot', "Sorry, I'm having trouble connecting to the server. Please try again later.");
        }
      }
    }
  
    // Function to redirect to email
    function redirectToEmail() {
      const email = 'support@example.com'; // Replace with your support email
      const subject = 'Support Request'; // Pre-filled subject
      const body = 'Hello, I need assistance with...'; // Pre-filled body
  
      // Create the mailto link
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
      // Open the default email client
      window.location.href = mailtoLink;
    }
  
    // Function to redirect to WhatsApp
    function redirectToWhatsApp() {
      const phoneNumber = '1234567890'; // Replace with your support phone number
      const message = 'Hello, I need assistance with...'; // Pre-filled message
  
      // Create the WhatsApp link
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
      // Open WhatsApp in a new tab
      window.open(whatsappLink, '_blank');
    }
  
    // Show the escalation options when the user clicks "Talk to a Human"
    supportBtn.addEventListener('click', () => {
      escalationOptions.style.display = 'block';
    });
  
    // Redirect to email
    emailBtn.addEventListener('click', redirectToEmail);
  
    // Redirect to WhatsApp
    whatsappBtn.addEventListener('click', redirectToWhatsApp);
  
    // Event listener for the send button
    sendBtn.addEventListener('click', sendMessage);
  
    // Event listener for the Enter key in the textbox
    textbox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });