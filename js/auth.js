(function(window) {
  function getToken() {
    return sessionStorage.getItem("token");
  }
  function getEmail(){
    return sessionStorage.getItem("email");
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
    // حذف بيانات الشركة المخزنة localStorage المرتبطة بأي companyData_*
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("companyData_")) {
        localStorage.removeItem(key);
      }
    });

    // حذف التوكن و البريد من sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    localStorage.removeItem("email")
    sessionStorage.removeItem("company_id");

    // إعادة توجيه لصفحة تسجيل الدخول
    window.location.href = "login.html";
  }

  // expose both under auth.* and globally
  window.auth = { getToken, saveToken, parseRole, logout };
  window.getToken     = getToken;
  window.saveToken    = saveToken;
  window.parseRole    = parseRole;
  window.logout       = logout;

})(window);


