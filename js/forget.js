
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("getMail");
    const submitBtn = document.querySelector(".btn-activity-confirm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !email.includes("@")) {
            alert("يرجى إدخال بريد إلكتروني صالح");
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
            if (!res.ok) throw new Error(data.message || "فشل في إرسال الرمز");
            return data;
        })
       .then(() => {
    localStorage.setItem("emailToVerify", email);
    alert("تم إرسال الكود إلى بريدك الإلكتروني.");
    window.location.href = "newpass.html"; // ← تم التوجيه إلى الصفحة المطلوبة
})

        .catch(error => {
            alert(error.message || "حدث خطأ غير متوقع");
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
            alert("يرجى إدخال بريد إلكتروني صالح.");
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
            if (!res.ok) throw new Error(data.message || "فشل في إرسال الكود.");
            return data;
        })
        .then(() => {
            localStorage.setItem("emailToVerify", email);
            alert("تم إرسال الكود إلى بريدك الإلكتروني.");
            window.location.href = "verify-code.html"; // ← غيري اسم الصفحة حسب صفحتك التالية
        })
        .catch(err => {
            alert(err.message || "حدث خطأ، يرجى المحاولة لاحقًا.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Signup";
        });
    });
});
