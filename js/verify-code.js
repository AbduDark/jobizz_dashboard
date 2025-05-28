document.getElementById("verifyForm").addEventListener("submit", async e => {
  e.preventDefault();
  const pin = [...document.querySelectorAll(".digit-cell")]
    .map(i => i.value).join("");
  if (pin.length !== 6) {
    showMessage("Enter 6-digit code", false);
    return;
  }
  const email = sessionStorage.getItem("emailToVerify");

  try {
    const res = await fetch("https://jobizaa.com/api/admin/verify-email", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email, pin_code: pin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showMessage("Verified! Redirecting...", true);
    setTimeout(() => window.location.href = "newpass.html", 1500);
  } catch (err) {
    showMessage(err.message, false);
  }
});
