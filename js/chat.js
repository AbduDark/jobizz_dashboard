const BASE_URL = 'https://jobizaa.com/api';

// الحصول على عناصر الصفحة
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
let chatHistory = [];
let companyId = null;

// فتح الشات مع بوت معين
function openChat(name, imgSrc) {
  document.getElementById('chatBox')?.classList.add('active');
  document.getElementById('botName').innerText = name;
  document.getElementById('botStatus').innerText = '🟢 متصل - جاهز للرد';
  document.getElementById('botImage')?.setAttribute('src', imgSrc);
  document.getElementById('botImage')?.style.setProperty('display', 'block');
  chatMessages.innerHTML = '';
  chatHistory = [
    {
      role: 'system',
      content: `أنت بوت اسمه ${name}، مصمم لدعم الشركات في إدارة الوظائف على منصة Jobizz. ساعد الشركات في إدارة الوظائف، الشركات، الفئات، الطلبات، المستخدمين، والمسؤولين باستخدام الـ APIs على ${BASE_URL}. استخدم ردودًا ودية باللغة العربية واطلب تفاصيل إضافية إذا لزم الأمر.`
    }
  ];
  appendMessage('bot', `👋 أهلاً بك! أنا ${name}، جاهز لمساعدتك في إدارة الوظائف والشركات على Jobizz. كيف يمكنني مساعدتك؟ (مثال: "نشر وظيفة جديدة" أو "عرض المتقدمين")`);
  fetchCompanyId();
}

// جلب معرف الشركة
async function fetchCompanyId() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    appendMessage('bot', '⚠️ يرجى تسجيل الدخول للوصول إلى بيانات الشركة.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 401) {
      appendMessage('bot', '⚠️ التوكن غير صالح. يرجى تسجيل الدخول مرة أخرى.');
      return;
    }
    const data = await response.json();
    companyId = data.data?.[0]?.id;
    if (!companyId) {
      appendMessage('bot', '⚠️ لم يتم العثور على بيانات الشركة. يرجى التحقق من إعدادات حسابك.');
    }
  } catch (error) {
    console.error(error);
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب بيانات الشركة.');
  }
}

// إرسال الرسالة
chatForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  chatHistory.push({ role: 'user', content: userMessage });
  userInput.value = '';

  appendMessage('bot', '⏳ جاري معالجة طلبك...');

  // معالجة الأوامر بناءً على الاقتراحات
  if (userMessage.includes('إعادة تعيين كلمة المرور')) {
    requestPasswordReset(userMessage);
  } else if (userMessage.includes('إنشاء كلمة مرور جديدة')) {
    createNewPassword(userMessage);
  } else if (userMessage.includes('إضافة شركة')) {
    addCompany(userMessage);
  } else if (userMessage.includes('عرض تفاصيل شركة')) {
    getCompanyDetails(userMessage);
  } else if (userMessage.includes('عرض جميع الشركات')) {
    getAllCompanies();
  } else if (userMessage.includes('تحديث بيانات شركة')) {
    updateCompany(userMessage);
  } else if (userMessage.includes('حذف شركة')) {
    deleteCompany(userMessage);
  } else if (userMessage.includes('نشر وظيفة') || userMessage.includes('إنشاء وظيفة')) {
    createJobPosting(userMessage);
  } else if (userMessage.includes('تحديث وظيفة')) {
    updateJob(userMessage);
  } else if (userMessage.includes('عرض تفاصيل وظيفة')) {
    getJobDetails(userMessage);
  } else if (userMessage.includes('عرض جميع الوظائف')) {
    getAllJobs();
  } else if (userMessage.includes('عرض وظائف الشركة')) {
    getCompanyJobs();
  } else if (userMessage.includes('حذف وظيفة')) {
    deleteJob(userMessage);
  } else if (userMessage.includes('إضافة فئة')) {
    addCategory(userMessage);
  } else if (userMessage.includes('عرض جميع الفئات')) {
    getAllCategories();
  } else if (userMessage.includes('عرض تفاصيل فئة')) {
    getCategoryDetails(userMessage);
  } else if (userMessage.includes('تحديث فئة')) {
    updateCategory(userMessage);
  } else if (userMessage.includes('حذف فئة')) {
    deleteCategory(userMessage);
  } else if (userMessage.includes('عرض المتقدمين') || userMessage.includes('عرض الطلبات')) {
    fetchApplications();
  } else if (userMessage.includes('عرض الطلبات المرفوضة')) {
    fetchRejectedApplications();
  } else if (userMessage.includes('تحديث حالة طلب')) {
    updateApplicationStatus(userMessage);
  } else if (userMessage.includes('استعادة طلب')) {
    restoreApplication(userMessage);
  } else if (userMessage.includes('حذف طلب')) {
    deleteApplication(userMessage);
  } else if (userMessage.includes('عرض المستخدمين')) {
    getAllUsers();
  } else if (userMessage.includes('حذف مستخدم')) {
    deleteUser(userMessage);
  } else if (userMessage.includes('تسجيل مسؤول')) {
    registerAdmin(userMessage);
  } else if (userMessage.includes('إضافة مسؤول رئيسي')) {
    addSuperAdmin(userMessage);
  } else if (userMessage.includes('التحقق من بريد المسؤول')) {
    verifyAdminEmail(userMessage);
  } else if (userMessage.includes('تسجيل دخول مسؤول')) {
    adminLogin(userMessage);
  } else if (userMessage.includes('تسجيل خروج مسؤول')) {
    adminLogout();
  } else if (userMessage.includes('الموافقة على مسؤول')) {
    approveAdmin(userMessage);
  } else if (userMessage.includes('إضافة مسؤول فرعي')) {
    addSubAdmin(userMessage);
  } else {
    // رد عام باستخدام API الشات الوهمي
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatHistory,
          temperature: 0.7
        })
      });
      const data = await response.json();
      chatMessages.lastChild.remove();
      const botReply = data.choices?.[0]?.message?.content?.trim() || 'معذرة، لم أفهم طلبك. حاول صياغته بشكل مختلف أو استخدم الاقتراحات السريعة.';
      appendMessage('bot', botReply);
      chatHistory.push({ role: 'assistant', content: botReply });
    } catch (error) {
      console.error(error);
      chatMessages.lastChild.remove();
      appendMessage('bot', '⚠️ حدث خطأ أثناء معالجة طلبك.');
    }
  }
});

// دالة لاستخراج التفاصيل من إدخال المستخدم
function extractDetails(message) {
  return {
    email: message.match(/بريد:?\s*([^\n,]+)/)?.[1] || '',
    password: message.match(/كلمة المرور:?\s*([^\n,]+)/)?.[1] || '',
    token: message.match(/توكن:?\s*([^\n,]+)/)?.[1] || '',
    company_name: message.match(/اسم الشركة:?\s*([^\n,]+)/)?.[1] || '',
    company_id: message.match(/معرف الشركة:?\s*([^\n,]+)/)?.[1] || '',
    title: message.match(/عنوان:?\s*([^\n,]+)/)?.[1] || '',
    description: message.match(/وصف:?\s*([^\n,]+)/)?.[1] || '',
    salary: message.match(/راتب:?\s*(\d+)/)?.[1] || '',
    location: message.match(/موقع:?\s*([^\n,]+)/)?.[1] || '',
    requirement: message.match(/متطلبات:?\s*([^\n,]+)/)?.[1] || '',
    benefits: message.match(/مزايا:?\s*([^\n,]+)/)?.[1] || '',
    job_type: message.match(/نوع الوظيفة:?\s*([^\n,]+)/)?.[1] || '',
    job_status: message.match(/حالة الوظيفة:?\s*([^\n,]+)/)?.[1] || '',
    position: message.match(/منصب:?\s*([^\n,]+)/)?.[1] || '',
    category_name: message.match(/فئة:?\s*([^\n,]+)/)?.[1] || '',
    category_id: message.match(/معرف الفئة:?\s*([^\n,]+)/)?.[1] || '',
    job_id: message.match(/معرف الوظيفة:?\s*([^\n,]+)/)?.[1] || '',
    application_id: message.match(/معرف الطلب:?\s*([^\n,]+)/)?.[1] || '',
    status: message.match(/حالة:?\s*([^\n,]+)/)?.[1] || '',
    user_id: message.match(/معرف المستخدم:?\s*([^\n,]+)/)?.[1] || '',
    admin_id: message.match(/معرف المسؤول:?\s*([^\n,]+)/)?.[1] || '',
    fullName: message.match(/الاسم الكامل:?\s*([^\n,]+)/)?.[1] || '',
    permissions: message.match(/الصلاحيات:?\s*([^\n,]+)/)?.[1] || ''
  };
}

// التحقق من التوكن
function checkToken() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    appendMessage('bot', '⚠️ يرجى تسجيل الدخول للوصول إلى هذه الوظيفة.');
    return false;
  }
  return token;
}

// معالجة الأخطاء
function handleApiError(response, customMessage) {
  if (response.status === 401) {
    appendMessage('bot', '⚠️ التوكن غير صالح. يرجى تسجيل الدخول مرة أخرى.');
    return false;
  }
  if (response.status === 429) {
    appendMessage('bot', '⚠️ لقد تجاوزت حد الطلبات. يرجى المحاولة مرة أخرى لاحقًا.');
    return false;
  }
  if (!response.ok) {
    appendMessage('bot', customMessage || '⚠️ حدث خطأ أثناء معالجة الطلب.');
    return false;
  }
  return true;
}

// دوال لكل endpoint
async function requestPasswordReset(message) {
  const details = extractDetails(message);
  if (!details.email) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني. مثال: "طلب إعادة تعيين كلمة المرور، بريد: example@domain.com"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ email: details.email }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل طلب إعادة تعيين كلمة المرور.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم إرسال طلب إعادة تعيين كلمة المرور إلى ${details.email}.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء طلب إعادة تعيين كلمة المرور.');
  }
}

async function createNewPassword(message) {
  const details = extractDetails(message);
  if (!details.email || !details.token || !details.password) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني، التوكن، وكلمة المرور الجديدة. مثال: "إنشاء كلمة مرور جديدة، بريد: example@domain.com، توكن: abc123، كلمة المرور: newpass"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        token: details.token,
        password: details.password
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل إنشاء كلمة المرور الجديدة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', '✅ تم إنشاء كلمة المرور الجديدة بنجاح.');
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء إنشاء كلمة المرور.');
  }
}

async function addCompany(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.company_name) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم اسم الشركة. مثال: "إضافة شركة جديدة، اسم الشركة: شركة مثال"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/companies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ name: details.company_name }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل إضافة الشركة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم إضافة الشركة "${data.data?.name || details.company_name}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء إضافة الشركة.');
  }
}

async function getCompanyDetails(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  const id = details.company_id || companyId;
  if (!id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الشركة أو التحقق من إعدادات حسابك.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/companies/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب تفاصيل الشركة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `📋 تفاصيل الشركة:\n- الاسم: ${data.data?.name || 'غير معروف'}\n- المعرف: ${data.data?.id || 'غير معروف'}`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب تفاصيل الشركة.');
  }
}

async function getAllCompanies() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب قائمة الشركات.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة الشركات:\n';
      data.data.forEach(company => {
        message += `- الاسم: ${company.name}, المعرف: ${company.id}\n`;
      });
      appendMessage('bot', message);
    } else {
      appendMessage('bot', '⚠️ لا توجد شركات حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب الشركات.');
  }
}

async function updateCompany(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  const id = details.company_id || companyId;
  if (!id || !details.company_name) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الشركة واسمها الجديد. مثال: "تحديث بيانات شركة، معرف الشركة: 123، اسم الشركة: شركة جديدة"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ name: details.company_name }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تحديث الشركة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تحديث الشركة "${data.data?.name || details.company_name}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تحديث الشركة.');
  }
}

async function deleteCompany(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  const id = details.company_id || companyId;
  if (!id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الشركة. مثال: "حذف شركة، معرف الشركة: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/companies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل حذف الشركة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم حذف الشركة بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء حذف الشركة.');
  }
}

async function createJobPosting(message) {
  const token = checkToken();
  if (!token) return;

  if (!companyId) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ لم يتم العثور على معرف الشركة. يرجى التحقق من إعدادات حسابك.');
    return;
  }

  const details = extractDetails(message);
  if (!details.title || !details.description) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم تفاصيل الوظيفة (مثل العنوان والوصف). مثال: "نشر وظيفة جديدة، عنوان: مطور ويب، وصف: تطوير تطبيقات الويب، راتب: 5000"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/add-job`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        category_name: details.category_name || 'tech',
        title: details.title,
        salary: details.salary || '3000',
        location: details.location || 'غير محدد',
        description: details.description,
        requirement: details.requirement || 'غير محدد',
        benefits: details.benefits || 'لا يوجد',
        job_type: details.job_type || 'Full-time',
        job_status: details.job_status || 'open',
        position: details.position || 'junior'
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل نشر الوظيفة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم نشر الوظيفة "${data.data?.title || details.title}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء نشر الوظيفة.');
  }
}

async function updateJob(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.job_id || !details.title) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الوظيفة والعنوان الجديد. مثال: "تحديث وظيفة، معرف الوظيفة: 123، عنوان: مطور ويب جديد"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/${details.job_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        category_name: details.category_name || 'tech',
        title: details.title,
        salary: details.salary || '3000',
        location: details.location || 'غير محدد',
        description: details.description || 'غير محدد',
        requirement: details.requirement || 'غير محدد',
        benefits: details.benefits || 'لا يوجد',
        job_type: details.job_type || 'Full-time',
        job_status: details.job_status || 'open',
        position: details.position || 'junior'
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تحديث الوظيفة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تحديث الوظيفة "${data.data?.title || details.title}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تحديث الوظيفة.');
  }
}

async function getJobDetails(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.job_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الوظيفة. مثال: "عرض تفاصيل وظيفة، معرف الوظيفة: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/${details.job_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب تفاصيل الوظيفة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `📋 تفاصيل الوظيفة:\n- العنوان: ${data.data?.title || 'غير معروف'}\n- الوصف: ${data.data?.description || 'غير معروف'}\n- الراتب: ${data.data?.salary || 'غير محدد'}\n- الموقع: ${data.data?.location || 'غير محدد'}`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب تفاصيل الوظيفة.');
  }
}

async function getAllJobs() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب قائمة الوظائف.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة الوظائف:\n';
      data.data.forEach(job => {
        message += `- العنوان: ${job.title}, المعرف: ${job.id}, الحالة: ${job.job_status}\n`;
      });
      appendMessage('bot', message);
      appendJobsChart(data.data);
    } else {
      appendMessage('bot', '⚠️ لا توجد وظائف حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب الوظائف.');
  }
}

async function getCompanyJobs() {
  const token = checkToken();
  if (!token) return;

  if (!companyId) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ لم يتم العثور على معرف الشركة. يرجى التحقق من إعدادات حسابك.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب وظائف الشركة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 وظائف الشركة:\n';
      data.data.forEach(job => {
        message += `- العنوان: ${job.title}, المعرف: ${job.id}, الحالة: ${job.job_status}\n`;
      });
      appendMessage('bot', message);
      appendJobsChart(data.data);
    } else {
      appendMessage('bot', '⚠️ لا توجد وظائف للشركة حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب وظائف الشركة.');
  }
}

async function deleteJob(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.job_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الوظيفة. مثال: "حذف وظيفة، معرف الوظيفة: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/${details.job_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل حذف الوظيفة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم حذف الوظيفة بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء حذف الوظيفة.');
  }
}

async function addCategory(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.category_name) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم اسم الفئة. مثال: "إضافة فئة جديدة، فئة: تقنية"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ name: details.category_name }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل إضافة الفئة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم إضافة الفئة "${data.data?.name || details.category_name}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء إضافة الفئة.');
  }
}

async function getAllCategories() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب قائمة الفئات.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة الفئات:\n';
      data.data.forEach(category => {
        message += `- الاسم: ${category.name}, المعرف: ${category.id}\n`;
      });
      appendMessage('bot', message);
    } else {
      appendMessage('bot', '⚠️ لا توجد فئات حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب الفئات.');
  }
}

async function getCategoryDetails(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.category_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الفئة. مثال: "عرض تفاصيل فئة، معرف الفئة: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/categories/${details.category_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب تفاصيل الفئة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `📋 تفاصيل الفئة:\n- الاسم: ${data.data?.name || 'غير معروف'}\n- المعرف: ${data.data?.id || 'غير معروف'}`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب تفاصيل الفئة.');
  }
}

async function updateCategory(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.category_id || !details.category_name) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الفئة واسمها الجديد. مثال: "تحديث فئة، معرف الفئة: 123، فئة: تقنية جديدة"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/categories/${details.category_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ name: details.category_name }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تحديث الفئة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تحديث الفئة "${data.data?.name || details.category_name}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تحديث الفئة.');
  }
}

async function deleteCategory(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.category_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الفئة. مثال: "حذف فئة، معرف الفئة: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/categories/${details.category_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل حذف الفئة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم حذف الفئة بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء حذف الفئة.');
  }
}

async function fetchApplications() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب المتقدمين.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة المتقدمين:\n';
      data.data.forEach(app => {
        message += `- المتقدم: ${app.user?.fullName || 'غير معروف'}, الوظيفة: ${app.job?.title || 'غير محدد'}, الحالة: ${app.status}, المعرف: ${app.id}\n`;
      });
      appendMessage('bot', message);
      appendApplicationsChart(data.data);
    } else {
      appendMessage('bot', '⚠️ لا توجد طلبات حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب المتقدمين.');
  }
}

async function fetchRejectedApplications() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/rejected-applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب الطلبات المرفوضة.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة الطلبات المرفوضة:\n';
      data.data.forEach(app => {
        message += `- المتقدم: ${app.user?.fullName || 'غير معروف'}, الوظيفة: ${app.job?.title || 'غير محدد'}, المعرف: ${app.id}\n`;
      });
      appendMessage('bot', message);
      appendApplicationsChart(data.data);
    } else {
      appendMessage('bot', '⚠️ لا توجد طلبات مرفوضة حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب الطلبات المرفوضة.');
  }
}

async function updateApplicationStatus(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.application_id || !details.status) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الطلب والحالة الجديدة. مثال: "تحديث حالة طلب، معرف الطلب: 123، حالة: مقبول"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/applications/${details.application_id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ status: details.status }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تحديث حالة الطلب.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تحديث حالة الطلب إلى "${details.status}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تحديث حالة الطلب.');
  }
}

async function restoreApplication(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.application_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الطلب. مثال: "استعادة طلب، معرف الطلب: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/applications/restore/${details.application_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل استعادة الطلب.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم استعادة الطلب بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء استعادة الطلب.');
  }
}

async function deleteApplication(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.application_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف الطلب. مثال: "حذف طلب، معرف الطلب: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/applications/${details.application_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل حذف الطلب.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم حذف الطلب بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء حذف الطلب.');
  }
}

async function getAllUsers() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب قائمة المستخدمين.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📋 قائمة المستخدمين:\n';
      data.data.forEach(user => {
        message += `- الاسم: ${user.fullName || 'غير معروف'}, المعرف: ${user.id}\n`;
      });
      appendMessage('bot', message);
    } else {
      appendMessage('bot', '⚠️ لا توجد مستخدمين حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب المستخدمين.');
  }
}

async function deleteUser(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.user_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف المستخدم. مثال: "حذف مستخدم، معرف المستخدم: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/users/${details.user_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل حذف المستخدم.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم حذف المستخدم بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء حذف المستخدم.');
  }
}

async function registerAdmin(message) {
  const details = extractDetails(message);
  if (!details.email || !details.password || !details.fullName) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني، كلمة المرور، والاسم الكامل. مثال: "تسجيل مسؤول جديد، بريد: admin@domain.com، كلمة المرور: pass123، الاسم الكامل: أحمد محمد"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        password: details.password,
        fullName: details.fullName
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تسجيل المسؤول.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تسجيل المسؤول "${details.fullName}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تسجيل المسؤول.');
  }
}

async function addSuperAdmin(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.email || !details.password || !details.fullName) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني، كلمة المرور، والاسم الكامل. مثال: "إضافة مسؤول رئيسي، بريد: admin@domain.com، كلمة المرور: pass123، الاسم الكامل: أحمد محمد"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/super-admins`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        password: details.password,
        fullName: details.fullName
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل إضافة المسؤول الرئيسي.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم إضافة المسؤول الرئيسي "${details.fullName}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء إضافة المسؤول الرئيسي.');
  }
}

async function verifyAdminEmail(message) {
  const details = extractDetails(message);
  if (!details.email || !details.token) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني والتوكن. مثال: "التحقق من بريد المسؤول، بريد: admin@domain.com، توكن: abc123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        token: details.token
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل التحقق من البريد الإلكتروني.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم التحقق من البريد الإلكتروني "${details.email}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء التحقق من البريد الإلكتروني.');
  }
}

async function adminLogin(message) {
  const details = extractDetails(message);
  if (!details.email || !details.password) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني وكلمة المرور. مثال: "تسجيل دخول مسؤول، بريد: admin@domain.com، كلمة المرور: pass123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        password: details.password
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل تسجيل الدخول.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    sessionStorage.setItem('token', data.data?.token);
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تسجيل الدخول بنجاح. التوكن محفوظ.`);
    fetchCompanyId();
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تسجيل الدخول.');
  }
}

async function adminLogout() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل تسجيل الخروج.')) {
      chatMessages.lastChild.remove();
      return;
    }
    sessionStorage.removeItem('token');
    companyId = null;
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم تسجيل الخروج بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء تسجيل الخروج.');
  }
}

async function approveAdmin(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.admin_id) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم معرف المسؤول. مثال: "الموافقة على مسؤول، معرف المسؤول: 123"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/admins/approve/${details.admin_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل الموافقة على المسؤول.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم الموافقة على المسؤول بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء الموافقة على المسؤول.');
  }
}

async function addSubAdmin(message) {
  const token = checkToken();
  if (!token) return;

  const details = extractDetails(message);
  if (!details.email || !details.fullName || !details.permissions) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ يرجى تقديم البريد الإلكتروني، الاسم الكامل، والصلاحيات. مثال: "إضافة مسؤول فرعي، بريد: subadmin@domain.com، الاسم الكامل: علي محمد، الصلاحيات: manage-jobs"');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/sub-admins`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: details.email,
        fullName: details.fullName,
        permissions: details.permissions
      }).toString()
    });
    if (!handleApiError(response, '⚠️ فشل إضافة المسؤول الفرعي.')) {
      chatMessages.lastChild.remove();
      return;
    }
    chatMessages.lastChild.remove();
    appendMessage('bot', `✅ تم إضافة المسؤول الفرعي "${details.fullName}" بنجاح.`);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء إضافة المسؤول الفرعي.');
  }
}

async function generateReport() {
  const token = checkToken();
  if (!token) return;

  if (!companyId) {
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ لم يتم العثور على معرف الشركة. يرجى التحقق من إعدادات حسابك.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/jobs/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (!handleApiError(response, '⚠️ فشل جلب التقرير.')) {
      chatMessages.lastChild.remove();
      return;
    }
    const data = await response.json();
    chatMessages.lastChild.remove();
    if (data.data?.length > 0) {
      let message = '📊 تقرير الوظائف:\n';
      data.data.forEach(job => {
        message += `- العنوان: ${job.title}, الحالة: ${job.job_status}, الموقع: ${job.location}\n`;
      });
      appendMessage('bot', message);
      appendJobsChart(data.data);
    } else {
      appendMessage('bot', '⚠️ لا توجد وظائف حاليًا.');
    }
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    appendMessage('bot', '⚠️ حدث خطأ أثناء جلب التقرير.');
  }
}

// دالة لإضافة رسالة إلى واجهة الشات
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// دالة لإنشاء رسم بياني للوظائف
function appendJobsChart(jobs) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);
  chatMessages.appendChild(chartContainer);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: jobs.map(job => job.title),
      datasets: [{
        label: 'عدد المتقدمين',
        data: jobs.map(job => job.applications_count || 0),
        backgroundColor: '#1a3c66',
        borderColor: '#1a3c66',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'عدد المتقدمين'
          }
        },
        x: {
          title: {
            display: true,
            text: 'الوظائف'
          }
        }
      }
    }
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// دالة لإنشاء رسم بياني للمتقدمين
function appendApplicationsChart(applications) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);
  chatMessages.appendChild(chartContainer);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'حالة الطلبات',
        data: Object.values(statusCounts),
        backgroundColor: ['#1a3c66', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// إضافة اقتراح للنص المدخل
function insertSuggestion(text) {
  userInput.value = text;
  userInput.focus();
}

// إخفاء/إظهار القوائم الجانبية للموبايل
function togglePanels() {
  document.querySelector('.chat-sidebar')?.classList.toggle('hidden');
  document.querySelector('.chat-suggestions')?.classList.toggle('hidden');
}