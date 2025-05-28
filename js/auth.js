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



  // expose both under auth.* and globally
  window.auth = { getToken, saveToken, parseRole, logout };
  window.getToken     = getToken;
  window.saveToken    = saveToken;
  window.parseRole    = parseRole;
  window.logout       = logout;

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

// تصدير الدوال للاستخدام في ملفات أخرى (بدون module)
