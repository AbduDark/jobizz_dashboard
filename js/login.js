// js/js/login.js
document.addEventListener("DOMContentLoaded", function() {
  const form       = document.getElementById("loginForm");
  const emailInput = document.getElementById("userEmail");
  const passInput  = document.getElementById("userPassword");
  const errorBox   = document.getElementById("error-message-box");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email    = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      errorBox.textContent = "Please fill all fields";
      errorBox.classList.add("show");
      return;
    }

    try {
      const res  = await fetch("https://jobizaa.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.message || "Login failed");
      }

      // 1) استخرج التوكن من payload.data.token
      const token = payload.data.token;
      if (!token) {
        throw new Error("Token not found in response");
      }

      console.log("Extracted token:", token);

      // 2) خزّنه في sessionStorage
      sessionStorage.setItem("token", token);

      console.log("Stored token:", sessionStorage.getItem("token"));

      // 3) وجّه المستخدم حسب دوره
      const role = auth.parseRole(token);
      window.location.href = (role === "super-admin")
        ? "index.html"
        : "profile.html";

    } catch (err) {
      console.error("Login error:", err);
      errorBox.textContent = err.message;
      errorBox.classList.add("show");
    }
  });
});
