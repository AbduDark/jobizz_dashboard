// ⚙️ إعدادات أساسية
const BASE_URL = "https://jobizaa.com/api";
const AUTH_TOKEN = "Bearer YOUR_ADMIN_API_TOKEN"; // ← استبدل بـ توكن حقيقي
const companyId = YOUR_COMPANY_ID; // ← استبدل بـ ID شركتك

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
let chatHistory = [];

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage("user", msg);
  chatHistory.push({ role: "user", content: msg });
  userInput.value = "";
  appendMessage("bot", "⏳ جارٍ المعالجة...");

  await handleBotCommand(msg);
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleBotCommand(input) {
  input = input.toLowerCase();
  chatMessages.lastChild.remove();

  if (input.includes("بيانات الشركة")) {
    return fetchCompanyInfo();
  }
  if (input.includes("اعرض الوظائف")) {
    return fetchCompanyJobs();
  }
  if (input.includes("اعرض المتقدمين")) {
    return fetchApplications();
  }

  appendMessage("bot", "🤖 آسف، لم أفهم طلبك. جرّب: 'اعرض الوظائف' أو 'اعرض المتقدمين'");
}

// 📦 1. جلب بيانات الشركة
async function fetchCompanyInfo() {
  try {
    const res = await fetch(`${BASE_URL}/admin/companies/${companyId}`, {
      headers: { Authorization: AUTH_TOKEN }
    });
    const data = await res.json();
    const c = data.data.company;
    appendMessage("bot", `🏢 اسم الشركة: ${c.name}\n📍 الموقع: ${c.location}\n👥 الموظفون: ${c.hired_people}\n🌐 موقع الويب: ${c.website}`);
  } catch (err) {
    console.error(err);
    appendMessage("bot", "❌ تعذر جلب بيانات الشركة.");
  }
}

// 📄 2. جلب الوظائف
async function fetchCompanyJobs() {
  try {
    const res = await fetch(`${BASE_URL}/admin/jobs/company/${companyId}`, {
      headers: { Authorization: AUTH_TOKEN }
    });
    const data = await res.json();
    if (!data.data?.length) return appendMessage("bot", "🚫 لا توجد وظائف حاليًا.");

    let list = data.data.map(j => `🔹 ${j.title} — 💰${j.salary} — 📍${j.location}`).join("\n");
    appendMessage("bot", `💼 الوظائف المتاحة:\n${list}`);
  } catch (err) {
    console.error(err);
    appendMessage("bot", "❌ حدث خطأ أثناء جلب الوظائف.");
  }
}

// 📨 3. جلب المتقدمين
async function fetchApplications() {
  try {
    const res = await fetch(`${BASE_URL}/admin/applications`, {
      headers: { Authorization: AUTH_TOKEN }
    });
    const data = await res.json();
    const apps = data.data.applications;

    if (!apps.length) return appendMessage("bot", "🚫 لا يوجد طلبات تقديم حتى الآن.");

    const list = apps.map(a => {
      return `👤 ${a.user.name} \n📧 ${a.user.email} \n💼 الوظيفة: ${a.job.title} \n📄 [السيرة الذاتية](${a.resume_path}) \n✅ الحالة: ${a.status}`;
    }).join("\n\n");

    appendMessage("bot", list);
  } catch (err) {
    console.error(err);
    appendMessage("bot", "❌ لم يتم جلب الطلبات.");
  }
}
