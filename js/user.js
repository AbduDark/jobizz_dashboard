const API_URL = "https://jobizaa.com/api/admin/users";
const TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0Njg4NDg4NSwibmJmIjoxNzQ2ODg0ODg1LCJqdGkiOiJKNFRQNDc0VDBYZmVkbHZSIiwic3ViIjoiMSIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2UtYWxsLWNvbXBhbmllcyIsIm1hbmFnZS1hbGwtam9icyIsIm1hbmFnZS1yb2xlcyIsIm1hbmFnZS1jb21wYW55LWFkbWlucyIsIm1hbmFnZS1hcHBsaWNhdGlvbnMiLCJ2aWV3LWFwcGxpY2FudC1wcm9maWxlcyIsInNlbmQtbWVzc2FnZXMiXSwiY29tcGFueV9pZCI6bnVsbH0.1okzsacodT2LkZoDo6e7N8nkNekwXxvFAuT1mjH0OE0";

let list = document.querySelectorAll(".sidebar li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}
list.forEach((item) => item.addEventListener("mouseover", activeLink));

// ✅ تحميل البيانات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", async function () {
  await updateDashboard();
  toggleView();
  setInterval(updateDashboard, 10000); // كل 30 ثانية
});

// ✅ تفعيل السايدبار
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const container = document.querySelector(".container");

  if (!sidebar || !container) return;

  sidebar.classList.toggle("open");

  if (sidebar.classList.contains("open")) {
    container.style.marginLeft = "220px";
    container.style.width = "calc(100% - 220px)";
  } else {
    container.style.marginLeft = "80px";
    container.style.width = "calc(100% - 80px)";
  }
}

// ✅ تحديث الداشبورد
async function updateDashboard() {
  showLoader();
  await Promise.all([fetchUsers(), fetchUserCount()]);
  hideLoader();
}

// ✅ جلب المستخدمين
async function fetchUsers() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: TOKEN,
      },
    });

    const data = await response.json();
    // console.log("API Response:", data);

    // استخراج المصفوفة حسب شكل الـ response
    const users = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.data?.users)
      ? data.data.users
      : [];

    populateTable(users);
    populateCards(users);
    toggleView();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// ✅ تحديث عدد المستخدمين
async function fetchUserCount() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: TOKEN,
      },
    });
    const res = await response.json();

    document.getElementById("user-count").textContent =
      res?.data?.users?.length;
  } catch (error) {
    console.error("Error fetching user count:", error);
  }
}

// ✅ تعبئة الجدول
function populateTable(users) {
  const tableBody = document.getElementById("user-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
              
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// ✅ تعبئة الكروت
function populateCards(users) {
  const cardsContainer = document.querySelector(".cards-container");
  if (!cardsContainer) return;
  cardsContainer.innerHTML = "";

  users.forEach((user) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <div class="card-buttons">
                <button class="edit" onclick="editUser(${user.id})">Edit</button>
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
    cardsContainer.appendChild(card);
  });
}

// ✅ تبديل العرض بين الجدول والكروت
function toggleView() {
  const tableContainer = document.querySelector(".table-container");
  const cardsContainer = document.querySelector(".cards-container");

  if (!tableContainer || !cardsContainer) return;

  if (window.innerWidth <= 768) {
    tableContainer.style.display = "none";
    cardsContainer.style.display = "flex";
  } else {
    tableContainer.style.display = "block";
    cardsContainer.style.display = "none";
  }
}
window.addEventListener("resize", toggleView);

// ✅ حذف مستخدم
async function deleteUser(userId) {
  if (!userId || isNaN(userId)) return;

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: TOKEN,
          },
        });
        if (response.ok) {
          Swal.fire("Deleted!", "User deleted successfully!", "success");
          await updateDashboard();
        } else {
          Swal.fire("Error!", "Error deleting user.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting the user.",
          "error"
        );
      }
    }
  });
}

// ✅ البحث في الجدول والكروت
function searchUsers() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("tbody tr");
  let cards = document.querySelectorAll(".cards-container .card");

  rows.forEach((row) => {
    let name = row.cells[1].textContent.toLowerCase();
    let email = row.cells[2].textContent.toLowerCase();
    row.style.display =
      name.includes(input) || email.includes(input) ? "" : "none";
  });

  cards.forEach((card) => {
    let name = card.querySelector("h3").textContent.toLowerCase();
    let email = card.querySelector("p").textContent.toLowerCase();
    card.style.display =
      name.includes(input) || email.includes(input) ? "" : "none";
  });
}

// ✅ عرض وإخفاء اللودر
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// ✅ الإشعارات
document
  .getElementById("notificationBell")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    const dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });
document.addEventListener("click", function (e) {
  if (!e.target.closest(".notification-container")) {
    document.getElementById("notificationDropdown").style.display = "none";
  }
});
document.querySelector(".mark-read").addEventListener("click", function () {
  document.querySelectorAll(".unread").forEach((item) => {
    item.classList.remove("unread");
  });
  document.querySelector(".notification-badge").textContent = "0";
});

// ✅ بيانات المستخدم من localStorage
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  if (username) {
    document.querySelector(".user-profile span").textContent =
      "Hi, " + username;
    document.querySelector(".user-info h3").textContent = username;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const imgElement = document.querySelector(".user-profile img");
  const profileImage = localStorage.getItem("profileImage");

  if (imgElement) {
    if (profileImage) {
      imgElement.src = profileImage;
    } else {
      imgElement.src =
        "./images/pngtree-vector-users-icon-png-image_856952.jpg";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const bellIcon = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  const viewAllLink = document.querySelector(".view-all");

  // إظهار / إخفاء قائمة الإشعارات عند الضغط على الجرس
  bellIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // إغلاق القائمة إذا تم النقر خارجها
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".notification-container")) {
      dropdown.style.display = "none";
    }
  });

  // عند الضغط على "View all" يتم التوجيه للصفحة
  viewAllLink.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = this.getAttribute("href");
  });
});
