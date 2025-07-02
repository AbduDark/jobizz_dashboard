// ————— Global variables —————
let currentBot = null;
let currentBotImage = '';

const API_ENDPOINT = "https://aijobizz-production.up.railway.app/api/chat/";

const chatMessages   = document.getElementById('chatMessages');
const botNameElem    = document.getElementById('botName');
const botImageElem   = document.getElementById('botImage');
const botStatusElem  = document.getElementById('botStatus');
const chatForm       = document.getElementById('chatForm');
const userInput      = document.getElementById('userInput');

// ————— Initialize on DOM load —————
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();

  // pick first active bot if any
  const defaultBot = document.querySelector('.chat-sidebar .suggestion.active');
  if (defaultBot) {
    const name = defaultBot.querySelector('span').textContent;
    const img  = defaultBot.querySelector('img').src;
    openChat(name, img);
  }
});

function setupEventListeners() {
  // form submit
  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (msg) sendMessage(msg);
    userInput.value = '';
  });

  // quick suggestions
  document.querySelectorAll('.chat-suggestions .suggestion')
    .forEach(el => el.addEventListener('click', () => {
      const text = el.textContent.replace(/[🔍💼ℹ️📝]/g, '').trim();
      userInput.value = text;
      chatForm.dispatchEvent(new Event('submit'));
    }));

  // bot selector
  document.querySelectorAll('.chat-sidebar .suggestion')
    .forEach(el => el.addEventListener('click', () => {
      document.querySelectorAll('.chat-sidebar .suggestion')
        .forEach(b => b.classList.remove('active'));

      el.classList.add('active');
      const name = el.querySelector('span').textContent;
      const img  = el.querySelector('img').src;
      openChat(name, img);
    }));

  // reset chat
  document.querySelector('.reset-chat-btn')
    .addEventListener('click', () => {
      if (currentBot) {
        openChat(currentBot, currentBotImage);
      } else {
        chatMessages.innerHTML = '';
        addBotMessage('Hello! Please select a bot to start chatting');
      }
    });
}

// ————— Open a conversation —————
function openChat(botName, botImage) {
  currentBot      = botName;
  currentBotImage = botImage;
  botNameElem.textContent   = botName;
  botImageElem.src          = botImage;
  botStatusElem.textContent = 'Online';
  chatMessages.innerHTML    = '';
  addBotMessage(`Hello! I'm ${botName}, your assistant at Jobizaa. How can I help you today?`);
}

// ————— UI helpers —————
function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.classList.add('message', 'bot');

  if (text === '...جاري التفكير') {
    msg.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>`;
  } else {
    // auto‑link URLs
    text = text.replace(/(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="chat-link">$1</a>');
    msg.innerHTML = text;
  }

  chatMessages.appendChild(msg);
  scrollChatToBottom();
  return msg;
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.classList.add('message', 'user');
  msg.textContent = text;
  chatMessages.appendChild(msg);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ————— Fetch from your Django DRF endpoint —————
async function getChatbotResponse(userMessage) {
  try {
    const resp = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      console.error("API Error Details:", errData);
      throw new Error(`API error ${resp.status}`);
    }

    const data = await resp.json();
    return data.reply || "Sorry, I couldn't process that.";
  } catch (err) {
    console.error("Chatbot API Error:", err);
    return "I'm having trouble connecting to support. Please try again later.";
  }
}

// ————— Fallback responses —————
const fallbackResponses = {
  "AI Assistant":      "Sorry, I'm offline right now. Please try again later.",
  "Technical Support": "Our technical support is currently unavailable. Try again later."
};

// ————— Single sendMessage implementation —————
async function sendMessage(message) {
  if (!currentBot) {
    alert('Please select a bot first.');
    return;
  }

  addUserMessage(message);
  const loading = addBotMessage("...جاري التفكير");

  try {
    let reply = await getChatbotResponse(message);

    // Strip any leading "Hi there! " (case‑insensitive)
    reply = reply.replace(/^Hi there!\s*/i, '');

    chatMessages.removeChild(loading);
    addBotMessage(reply);
  } catch {
    chatMessages.removeChild(loading);
    const fb = fallbackResponses[currentBot]
             || "Sorry, I'm having trouble responding right now.";
    addBotMessage(fb);
  }
}

// ————— Typing indicator CSS —————
const style = document.createElement('style');
style.innerHTML = `
.typing-indicator { display:flex; gap:5px; padding:10px 15px; }
.typing-indicator span { width:8px; height:8px; background:#333; border-radius:50%; animation:typing 1s infinite; }
.typing-indicator span:nth-child(2) { animation-delay:0.2s; }
.typing-indicator span:nth-child(3) { animation-delay:0.4s; }
@keyframes typing { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-5px);} }
`;
document.head.appendChild(style);
