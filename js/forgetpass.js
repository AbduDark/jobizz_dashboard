document.querySelector("form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.getMail.value.trim();

  try {
    const res = await fetch("https://jobizaa.com/api/admin/password/reset-request", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    sessionStorage.setItem("emailToVerify", email);
    window.location.href = "verify-code.html";
  } catch (err) {
    alert(err.message);
  }
});
