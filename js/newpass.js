document.getElementById("resetPasswordForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const pin   = e.target.verificationCode.value.trim();
  const pwd   = e.target.newPassword.value;
  const conf  = e.target.confirmPassword.value;

  if (pwd !== conf) {
    showMessage("Passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch("https://jobizaa.com/api/admin/password/new-password", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        email, pinCode: pin,
        newPassword: pwd,
        newPassword_confirmation: conf
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showMessage("Password reset! Redirecting...", "success");
    setTimeout(() => window.location.href = "login.html", 1500);
  } catch (err) {
    showMessage(err.message, "error");
  }
});
