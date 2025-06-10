document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("userEmail");
  const passwordInput = document.getElementById("userPassword");
  const errorBox = document.getElementById("error-message-box");
  const loginButton = document.getElementById("loginButton");
  const togglePassword = document.getElementById("togglePassword");

  if (!form) return;

  // إظهار/إخفاء كلمة المرور
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
      showError("Please enter your email and password.");
      return;
    }

    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner"></span> Logging in...';
    loginButton.classList.add("btn-loading");
    hideError();

    try {
      const res = await fetch("https://jobizaa.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "login failed");

      const token = payload.data?.token;
      if (!token) throw new Error("Token not received from server");
      

      // ✅ حفظ التوكن والبريد الإلكتروني في sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userEmail", email);
        const decoded = parseJwt(token);
      const companyId = decoded?.company_id;
      const roles = decoded?.roles || [];
      if (companyId) {
        sessionStorage.setItem("company_id", companyId);
      }

      showSuccess("Login Successful. Redirecting...");


      const role = parseRole(token);
      showSuccess("Login Successfully! You will be redirected...✅");

      setTimeout(() => {
        window.location.href = (role === "super-admin") ? "index.html" : "profile.html";
      }, 1500);
      
    } catch (err) {
      console.error("Login error:", err);
      showError(err.message || "An unexpected error occurred while logging in.❗️");
    } finally {
      resetButton();
    }
  });
   function parseJwt(token) {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  }

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





