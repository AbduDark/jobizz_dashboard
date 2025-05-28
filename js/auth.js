// js/js/auth.js
(function(window) {
  function getToken() {
    return sessionStorage.getItem("token");
  }

  function saveToken(token) {
    sessionStorage.setItem("token", token);
  }

  function parseRole(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.roles ? payload.roles[0] : null;
    } catch {
      return null;
    }
  }

  function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  }

  function protectPage(allowedRoles) {
    const token = getToken();
    if (!token) return window.location.href = "login.html";
    const role = parseRole(token);
    if (allowedRoles.indexOf(role) === -1) {
      return window.location.href = "unauthorized.html";
    }
  }

  // expose both under auth.* and globally
  window.auth = { getToken, saveToken, parseRole, logout, protectPage };
  window.getToken     = getToken;
  window.saveToken    = saveToken;
  window.parseRole    = parseRole;
  window.logout       = logout;
  window.protectPage  = protectPage;
})(window);
function parseRole(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    const payloadObj = JSON.parse(decodedPayload);
    const roles = payloadObj.roles;
    return Array.isArray(roles) ? roles[0] : null;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

// دالة لحماية الصفحات بناءً على الرول
function protectPage(allowedRoles = []) {
  const token = sessionStorage.getItem("token");
  const role = parseRole(token);

  if (!token || !role || !allowedRoles.includes(role)) {
    // عرض رسالة الرفض إذا كانت موجودة بالصفحة
    const accessDeniedDiv = document.getElementById("access-denied");
    if (accessDeniedDiv) {
      accessDeniedDiv.style.display = "block";
    } else {
      // أو تحويل المستخدم لصفحة تسجيل الدخول
      window.location.href = "login.html";
    }
  }
}

// تصدير الدوال للاستخدام في ملفات أخرى (بدون module)
window.parseRole = parseRole;
window.protectPage = protectPage; 
  (function () {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles || [];

    const allowedForAdmin = ["job.html", "view.html", "profile.html", "chat.html"];
    const currentPage = window.location.pathname.split("/").pop();

    if (roles.includes("admin") && !allowedForAdmin.includes(currentPage)) {
      document.body.innerHTML = ''; // امسح المحتوى الحالي
      document.getElementById("accessModal").style.display = "flex";
    }
  })();