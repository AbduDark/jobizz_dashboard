  function protectPage(allowedRoles) {
    const token = getToken();
    if (!token) return window.location.href = "login.html";
    const role = parseRole(token);
    if (allowedRoles.indexOf(role) === -1) {
      return window.location.href = "unauthorized.html";
    }
  }
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
