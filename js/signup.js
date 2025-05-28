document.querySelector("form").addEventListener("submit", async e => {
  e.preventDefault();
  const fullName = e.target.setName.value.trim();
  const email    = e.target.setMail.value.trim();
  const phone    = e.target.setPhone.value.trim();
  const password = e.target.setPassword.value;
  const confirm  = e.target.setConfirmPassword.value;

  if (password !== confirm) {
    return document.getElementById("setConfirmPasswordError")
      .textContent = "Passwords do not match";
  }

  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("password_confirmation", confirm);

  try {
    const res = await fetch("https://jobizaa.com/api/admin/register", {
      method: "POST", body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      for (let [k, errs] of Object.entries(data.errors||{})) {
        document.getElementById(`${k}Error`).textContent = errs[0];
      }
      throw new Error(data.message);
    }
    sessionStorage.setItem("emailToVerify", email);
    window.location.href = "verify-code.html";
  } catch (err) {
    const msg = document.getElementById("registerMessage");
    msg.textContent = err.message;
    msg.classList.add("error-message");
  }
});
