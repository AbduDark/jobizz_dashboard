document.getElementById("resetPasswordForm").addEventListener("submit", async e => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const pin   = document.getElementById("verificationCode").value.trim();
  const pwd   = document.getElementById("newPassword").value;
  const conf  = document.getElementById("confirmPassword").value;

  if (pwd !== conf) {
    showMessage("Passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch("https://jobizaa.com/api/admin/password/new-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        pinCode: pin,
        newPassword: pwd,
        newPassword_confirmation: conf
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unknown error");

    showMessage("Password reset! Redirecting...", "success");
    setTimeout(() => window.location.href = "login.html", 1500);
  } catch (err) {
    showMessage(err.message, "error");
  }
});

function showMessage(message, type) {
  const box = document.getElementById("message-box");
  box.textContent = message;
  box.className = `message-box show ${type}`;
}
