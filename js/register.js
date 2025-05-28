// add hovered class to selected list item
let list = document.querySelectorAll(".sidebar li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// تبديل بين نموذج تسجيل الدخول وإنشاء الحساب

function toggleForm() {
  document.getElementById("login-form").classList.toggle("hidden");
  document.getElementById("signup-form").classList.toggle("hidden");
}

// محاكاة تسجيل الدخول
function login() {
  let username = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  if (username === "" || password === "") {
    alert("Please fill all fields!");
  } else {
    alert("Login Successful!");
    // يمكنك توجيه المستخدم إلى الصفحة الرئيسية هنا
  }
}

// محاكاة إنشاء الحساب
function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let username = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;
  let termsChecked = document.getElementById("agree-terms").checked;

  if (name === "" || email === "" || username === "" || password === "") {
    alert("Please fill all fields!");
  } else if (!termsChecked) {
    alert("You must agree to the terms and conditions!");
  } else {
    alert("Account Created Successfully!");
    toggleForm(); // تحويل المستخدم إلى صفحة تسجيل الدخول بعد التسجيل
  }
}

function signup() {
  // توجيه المستخدم إلى الصفحة الرئيسية
  window.location.href = "Dashboad.html"; // استبدل 'index.html' برابط الصفحة الرئيسية الخاصة بك
}

async function login() {
  let username = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  if (username === "" || password === "") {
    alert("Please fill all fields!");
    return;
  }

  // API وهمي للتحقق من المستخدم
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  let users = await response.json();

  let user = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "profile.html"; // تحويل المستخدم إلى الصفحة الشخصية
  } else {
    alert("Invalid username or password!");
  }
}

async function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let username = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;
  let termsChecked = document.getElementById("agree-terms").checked;

  if (name === "" || email === "" || username === "" || password === "") {
    alert("Please fill all fields!");
    return;
  }

  if (!termsChecked) {
    alert("You must agree to the terms and conditions!");
    return;
  }

  let user = { name, email, username };
  localStorage.setItem("user", JSON.stringify(user));

  alert("Account Created Successfully!");
  window.location.href = "profile.html"; // توجيه المستخدم إلى الملف الشخصي
}
