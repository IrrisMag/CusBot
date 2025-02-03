document.addEventListener('DOMContentLoaded', () => {
  // Optional: Ensure the Bootstrap navbar toggler works
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function () {
      const navbarNav = document.getElementById('navbarNav');
      let collapseInstance = bootstrap.Collapse.getInstance(navbarNav);
      if (!collapseInstance) {
        collapseInstance = new bootstrap.Collapse(navbarNav, { toggle: false });
      }
      if (navbarNav.classList.contains('show')) {
        collapseInstance.hide();
      } else {
        collapseInstance.show();
      }
    });
  }

  // DOM Elements
  const chatContainer = document.getElementById('chatContainer');
  const textbox = document.getElementById('textbox');
  const sendBtn = document.getElementById('sendBtn');
  const escalationOptions = document.getElementById('escalationOptions');
  const emailBtn = document.getElementById('emailBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const supportBtn = document.getElementById('supportBtn');
  const languageSelector = document.getElementById('language');
  const faqContainer = document.getElementById('faqContainer');
  const searchFaq = document.getElementById('searchFaq');
  const showMoreBtn = document.getElementById('showMoreBtn');

  let visibleFaqs = 3;
  let allFaqs = [];

  // Function to add a message to the chat container
  function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-2 ${sender === 'user' ? 'text-end' : 'text-start'}`;
    messageDiv.innerHTML = `
      <span class="d-inline-block p-3 rounded ${sender === 'user' ? 'bg-primary text-white' : 'bg-green'}">
        ${message}
      </span>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
  }

  // Function to send user message to the backend with an artificial delay for bot responses
  async function sendMessage() {
    const message = textbox.value.trim();
    if (message) {
      addMessage('user', message);
      textbox.value = '';

      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'text-start mb-2';
      loadingDiv.innerHTML = `
        <span class="d-inline-block p-3 rounded bg-green">
          <i class="fas fa-spinner fa-spin"></i> Thinking...
        </span>
      `;
      chatContainer.appendChild(loadingDiv);

      try {
        // Send the message to the backend
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            language: languageSelector.value,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Artificial delay (e.g., 2 seconds) before showing the bot's response
        setTimeout(() => {
          if (chatContainer.contains(loadingDiv)) {
            chatContainer.removeChild(loadingDiv);
          }
          addMessage('bot', data.response);
        }, 2000); // 2000 ms delay
      } catch (error) {
        console.error('Error sending message:', error);
        if (chatContainer.contains(loadingDiv)) {
          chatContainer.removeChild(loadingDiv);
        }
        addMessage('bot', "Sorry, I'm having trouble connecting to the server. Please try again later.");
      }
    }
  }

  // Function to render FAQs
  function renderFaqs(faqs) {
    faqContainer.innerHTML = ''; // Clear existing FAQs

    faqs.slice(0, visibleFaqs).forEach((faq, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'accordion-item';
      faqItem.innerHTML = `
        <h2 class="accordion-header" id="faqHeading${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse${index}" aria-expanded="false" aria-controls="faqCollapse${index}">
            ${faq.question}
          </button>
        </h2>
        <div id="faqCollapse${index}" class="accordion-collapse collapse" aria-labelledby="faqHeading${index}" data-bs-parent="#faqContainer">
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      `;
      faqContainer.appendChild(faqItem);
    });

    // Show or hide the "Show More" button
    showMoreBtn.style.display = faqs.length > visibleFaqs ? 'block' : 'none';
  }

  // Function to filter FAQs based on search input
  function filterFaqs(query) {
    const filteredFaqs = allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(query.toLowerCase())
    );
    renderFaqs(filteredFaqs);
  }

  // Fetch FAQs from the backend with an artificial delay to simulate file loading
  async function fetchFaqs() {
    try {
      faqContainer.innerHTML = '<p class="text-center">Loading FAQs...</p>';
      const language = languageSelector.value; // Get the selected language
      const response = await fetch(`/api/faqs?language=${language}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Artificial delay (e.g., 1.5 seconds) before rendering FAQs
      setTimeout(() => {
        allFaqs = data;
        renderFaqs(allFaqs);
      }, 1500);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      faqContainer.innerHTML = '<p class="text-danger">Unable to load FAQs, please try again later.</p>';
    }
  }

  // Event listener for the search input
  searchFaq.addEventListener('input', () => {
    filterFaqs(searchFaq.value);
  });

  // Event listener for the "Show More" button
  showMoreBtn.addEventListener('click', () => {
    visibleFaqs += 3; // Increase the number of visible FAQs
    renderFaqs(allFaqs);
  });

  // Event listener for the language selector
  languageSelector.addEventListener('change', () => {
    // Reset visible FAQs count when language changes
    visibleFaqs = 3;
    fetchFaqs();  // Refetch FAQs in the selected language
  });

  // Fetch FAQs on page load
  fetchFaqs();

  // Function to redirect to email
  function redirectToEmail() {
    const email = 'magneirris@gmail.com';
    const subject = 'Support Request';
    const body = 'Hello, I need assistance with...';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  // Function to redirect to WhatsApp
  function redirectToWhatsApp() {
    const phoneNumber = '662173348';
    const message = 'Hello, I need assistance with...';
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  }

  supportBtn.addEventListener('click', () => {
    escalationOptions.style.display = 'block';
  });

  emailBtn.addEventListener('click', redirectToEmail);
  whatsappBtn.addEventListener('click', redirectToWhatsApp);
  sendBtn.addEventListener('click', sendMessage);

  textbox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
