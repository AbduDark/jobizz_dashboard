// login.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("userEmail");
  const passInput = document.getElementById("userPassword");
  const errorBox = document.getElementById("error-message-box");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      errorBox.textContent = "Please fill all fields";
      errorBox.classList.add("show"); 
      return;
    }

    try {
      const res = await fetch("https://jobizaa.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json();

      if (!res.ok) throw new Error(payload.message || "Login failed");

      const token = payload.data.token;
      if (!token) throw new Error("Token not found in response");

      // Store token in sessionStorage
      sessionStorage.setItem("token", token);

      // Parse token manually to extract role
      const role = parseRole(token);
      if (role === "super-admin") {
        window.location.href = "index.html";
      } else {
        window.location.href = "profile.html";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorBox.textContent = err.message;
      errorBox.classList.add("show");
    }
  });

  // Helper to decode JWT and extract role
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