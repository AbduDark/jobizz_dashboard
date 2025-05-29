
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("getMail");
    const submitBtn = document.querySelector(".btn-activity-confirm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !email.includes("@")) {
            alert("Please enter a vaild email.❗️");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        fetch("https://jobizaa.com/api/admin/password/reset-request", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send code❗️");
            return data;
        })
       .then(() => {
    localStorage.setItem("emailToVerify", email);
    alert("The code has been sent to your email.✅");
    window.location.href = "newpass.html"; // ← تم التوجيه إلى الصفحة المطلوبة
})

        .catch(error => {
            alert(error.message || "An unexpected error occurred!");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Signup";
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resetRequestForm");
    const emailInput = document.getElementById("getMail");
    const submitBtn = document.querySelector(".btn-activity-confirm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !email.includes("@")) {
            alert("Please enter a vaild email.❗️");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        fetch("https://jobizaa.com/api/admin/password/reset-request", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send code❗️");
            return data;
        })
        .then(() => {
            localStorage.setItem("emailToVerify", email);
            alert("The code has been sent to your email.✅");
            window.location.href = "verify-code.html"; // ← غيري اسم الصفحة حسب صفحتك التالية
        })
        .catch(err => {
            alert(err.message || "Error occurred, Please Try Again.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Signup";
        });
    });
});
