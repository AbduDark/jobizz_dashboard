document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("userEmail");
  const passwordInput = document.getElementById("userPassword");
  const errorBox = document.getElementById("error-message-box");
  const loginButton = document.getElementById("loginButton");
  const togglePassword = document.getElementById("togglePassword");

  if (!form) return;

  // عرض/إخفاء كلمة المرور
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    // زر التحميل
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner"></span> جاري تسجيل الدخول...';
    loginButton.classList.add("btn-loading");
    hideError();

    try {
      const res = await fetch("https://jobizaa.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json();

      if (!res.ok) throw new Error(payload.message || "فشل تسجيل الدخول");

      const token = payload.data?.token;
      if (!token) throw new Error("لم يتم استلام التوكن من الخادم");

      // حفظ التوكن
      sessionStorage.setItem("token", token);

      // استخراج الدور من التوكن
      const role = parseRole(token);

      showSuccess("تم تسجيل الدخول بنجاح! سيتم التحويل...");

      setTimeout(() => {
        if (role === "super-admin") {
          window.location.href = "index.html";
        } else {
          window.location.href = "profile.html";
        }
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      showError(err.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول.");
    } finally {
      resetButton();
    }
  });

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add("show");
    errorBox.classList.remove("success-box");
  }

  function showSuccess(message) {
    errorBox.textContent = message;
    errorBox.classList.add("show", "success-box");
  }

  function hideError() {
    errorBox.classList.remove("show", "success-box");
  }

  function resetButton() {
    loginButton.disabled = false;
    loginButton.innerHTML = "Login";
    loginButton.classList.remove("btn-loading");
  }

  // دالة استخراج الدور من التوكن (JWT)
  function parseRole(token) {
    try {
      const base64Payload = token.split(".")[1];
      const jsonPayload = atob(base64Payload);
      const { roles } = JSON.parse(jsonPayload);
      return roles && roles.length ? roles[0] : null;
    } catch (e) {
      return null;
    }
  }
});
