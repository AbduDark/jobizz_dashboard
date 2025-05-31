// Global variables
let currentBot = null;
let currentBotImage = '';
const chatMessages = document.getElementById('chatMessages');
const botNameElem = document.getElementById('botName');
const botImageElem = document.getElementById('botImage');
const botStatusElem = document.getElementById('botStatus');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');


const API_KEY = "AIzaSyCJNbYgkoS6Kdf5OMfqu2_Iw-j_iAvAfsY"; 

// Site description
const siteDescription = `
موقعنا اسمه "Jobizaa" هو منصة توظيف عربية تهدف إلى ربط الباحثين عن عمل بأصحاب العمل.
نقدم خدمات مثل:
- نشر الوظائف من قبل الشركات
- البحث عن الوظائف المناسبة للباحثين
- إنشاء سيرة ذاتية احترافية
- نصائح مهنية وتدريبية

سياساتنا:
- مجاني للباحثين عن عمل
- الشركات تدفع رسوماً لنشر الوظائف
- نحرص على جودة الوظائف المعلن عنها

عنوان الموقع: https://jobizaa.com
`;

// Few-shot examples
const fewShotExamples = `
أمثلة على الأسئلة والأجوبة:
- السؤال: "كيف أبحث عن وظيفة؟"
  الجواب: "يمكنك البحث عن وظيفة بالذهاب إلى صفحة 'البحث عن وظائف' واستخدام الفلاتر المختلفة لتضييق نتائج البحث حسب المجال أو الموقع أو الراتب."

- السؤال: "كيف أنشر وظيفة في الموقع؟"
  الجواب: "لنشر وظيفة، يجب أن تكون شركة مسجلة. بعد تسجيل الدخول بحساب الشركة، اضغط على 'نشر وظيفة' واملأ التفاصيل المطلوبة."

- السؤال: "هل الموقع مجاني؟"
  الجواب: "البحث عن وظائف والتقديم عليها مجاني تماماً للباحثين عن عمل. أما الشركات فتدفع رسوماً لنشر الوظائف حسب الباقة المختارة."
`;

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Initialize with default bot
    const defaultBot = document.querySelector('.chat-sidebar .suggestion.active');
    if (defaultBot) {
        const botName = defaultBot.querySelector('span').textContent;
        const botImage = defaultBot.querySelector('img').src;
        openChat(botName, botImage);
    }
});

function setupEventListeners() {
    // Chat form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message === '') return;
        sendMessage(message);
        userInput.value = '';
    });

    // Quick suggestion clicks
    document.querySelectorAll('.chat-suggestions .suggestion').forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const text = this.textContent.replace(/[🔍💼ℹ️📝]/g, '').trim();
            userInput.value = text;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Bot selection
    document.querySelectorAll('.chat-sidebar .suggestion').forEach(bot => {
        bot.addEventListener('click', function() {
            // Remove active class from all bots
            document.querySelectorAll('.chat-sidebar .suggestion').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked bot
            this.classList.add('active');
            
            const botName = this.querySelector('span').textContent;
            const botImage = this.querySelector('img').src;
            openChat(botName, botImage);
        });
    });

    // Reset chat button
    document.querySelector('.reset-chat-btn').addEventListener('click', function() {
        if (currentBot) {
            openChat(currentBot, currentBotImage);
        } else {
            chatMessages.innerHTML = '';
            addBotMessage('Hello! Please select a bot to start chatting');
        }
    });
}

/**
 * Open chat with a specific bot
 * @param {string} botName 
 * @param {string} botImage 
 */
function openChat(botName, botImage) {
    currentBot = botName;
    currentBotImage = botImage;
    
    botNameElem.textContent = botName;
    botImageElem.src = botImage;
    botStatusElem.textContent = 'Online';
    
    // Reset chat history
    chatMessages.innerHTML = '';
    addBotMessage(`Hello! I'm ${botName}, your assistant at Jobizaa. How can I help you today?`);
}

/**
 * Add bot message to chat
 * @param {string} text 
 */
function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('message', 'bot');
    
    if (text === "...جاري التفكير") {
        msg.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    } else {
        // Convert links to clickable links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="chat-link">$1</a>');
        
        // Add icons for links
        text = text.replace(/عنوان الموقع:/g, '🌐 عنوان الموقع:');
        text = text.replace(/زيارة:/g, '🔗 يمكنك زيارة:');
        
        msg.innerHTML = text;
    }
    
    chatMessages.appendChild(msg);
    scrollChatToBottom();
    return msg;
}

/**
 * Add user message to chat
 * @param {string} text 
 */
function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('message', 'user');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    scrollChatToBottom();
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Get response from Hugging Face API
 * @param {string} userMessage 
 * @returns {Promise<string>} 
 */
async function getGoogleAPISResponse(userMessage) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: userMessage }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 100,
                        temperature: 0.7
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Details:", errorData);
            if (response.status === 403) {
                throw new Error("Authorization failed - check your API key");
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text || "Sorry, I couldn't process your request.";
    } catch (error) {
        console.error("API Error:", error);
        return "I'm having trouble connecting to the AI service. Please try again later.";
    }
}
/**
 * Add guide links for keywords
 * @param {string} reply 
 * @param {string} userMessage 
 * @returns {string}
 */
function addGuideLinks(reply, userMessage) {
    const keywords = {
        "وظيف": "https://jobizaa.com/jobs",
        "عمل": "https://jobizaa.com/jobs",
        "شركة": "https://jobizaa.com/companies",
        "منشأة": "https://jobizaa.com/companies",
        "سيرة": "https://jobizaa.com/profile",
        "cv": "https://jobizaa.com/profile",
        "تسجيل": "https://jobizaa.com/register",
        "حساب": "https://jobizaa.com/login"
    };
    
    for (const [key, link] of Object.entries(keywords)) {
        if (userMessage.includes(key) && !reply.includes(link)) {
            reply += `\n\n🔗 You can visit: <a href="${link}" target="_blank" class="chat-link">${link}</a>`;
            break;
        }
    }
    
    return reply;
}

/**
 * Send message to bot
 * @param {string} message 
 */
async function sendMessage(message) {
    if (!currentBot) {
        alert('Please select a bot first.');
        return;
    }

    addUserMessage(message);
    
    // Show loading indicator
    const loadingMsg = addBotMessage("...جاري التفكير");
    
    try {
        const reply = await getHuggingFaceResponse(message);
        chatMessages.removeChild(loadingMsg);
        addBotMessage(reply);
    } catch (error) {
        chatMessages.removeChild(loadingMsg);
        addBotMessage("An error occurred while communicating with the service");
    }
}
const fallbackResponses = {
    "AI Assistant": "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later or ask a different question.",
    "Technical Support": "Our technical support system is currently unavailable. Please check our FAQ or try again later.",
    // Add more fallbacks as needed
};

async function sendMessage(message) {
    if (!currentBot) {
        alert('Please select a bot first.');
        return;
    }

    addUserMessage(message);
    const loadingMsg = addBotMessage("...جاري التفكير");
    
    try {
        const reply = await getHuggingFaceResponse(message);
        chatMessages.removeChild(loadingMsg);
        addBotMessage(reply);
    } catch (error) {
        chatMessages.removeChild(loadingMsg);
        // Use fallback response
        const fallback = fallbackResponses[currentBot] || "Sorry, I'm having trouble responding right now.";
        addBotMessage(fallback);
    }
}
// Toggle panels for mobile view
function togglePanels() {
    const chatLayout = document.getElementById('chatLayout');
    chatLayout.classList.toggle('show-panels');
}

// Add typing indicator styles
const style = document.createElement('style');
style.innerHTML = `
    .typing-indicator {
        display: flex;
        gap: 5px;
        padding: 10px 15px;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #333;
        border-radius: 50%;
        animation: typing 1s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
    }
`;
document.head.appendChild(style);
