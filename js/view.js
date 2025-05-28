const API_URL = "https://jobizaa.com/api/admin/applications";
const TOKEN = "Bearer " + sessionStorage.getItem('token');
let usersData = [];

document.addEventListener("DOMContentLoaded", async function () {
  await updateDashboard();
  loadUserProfile();
  setupNotifications();
});

async function updateDashboard() {
  showLoader();
  await fetchUsers();
  hideLoader();
}

async function fetchUsers() {
  if (!TOKEN) return console.error("No auth token found.");

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const result = await response.json();
    console.log("API Response:", result);

    usersData = result.data.applications || [];
    populateTable(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function populateTable(users) {
  const tableBody = document.getElementById("user-table-body");
  const cardsContainer = document.getElementById("cards-container");

  tableBody.innerHTML = "";
  cardsContainer.innerHTML = "";

  if (!Array.isArray(users)) return;

  users.forEach((user) => {
    const name = user.user?.name || "N/A";
    const email = user.user?.email || "N/A";

    // Table Row
    const row = document.createElement("tr");
    row.innerHTML = `  
  <tr>
    <td>${user.id}</td>
    <td>${user.user.name}</td>
    <td>${user.user.email}</td>
    <td><span class="custom-status">${user.status.replaceAll("-", " ")}</span></td>
    <td>
      <button onclick="acceptUser(${user.id})" class="btn btn-success btn-sm">Accept</button>
      <button onclick="viewDetails(${user.id})" class="btn btn-primary btn-sm">Details</button>
      <button onclick="deleteUser(${user.id})" class="btn btn-danger btn-sm">Delete</button>
    </td>
  </tr>
`;
        
    tableBody.appendChild(row);

    // Card View
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <h3>ID: ${user.id}</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div class="card-buttons">
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
                <button class="accept" onclick="acceptUser(${user.id})">Accept</button>
                <button class="details" onclick="viewDetails(${user.id})">Details</button>
            </div>
        `;
    cardsContainer.appendChild(card);
  });
}

async function deleteUser(userId) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
        headers: { Authorization:TOKEN },
      });

      if (response.ok) {
        Swal.fire("Deleted!", "User deleted successfully!", "success");
        await updateDashboard();
      } else {
        Swal.fire("Error!", "Error deleting user.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  }
}

async function acceptUser(userId) {
  if (!userId || userId === "undefined") {
    console.error("Invalid userId:", userId);
    Swal.fire("Error!", "User ID is missing or invalid", "error");
    return;
  }

  const result = await Swal.fire({
    icon: "question",
    title: "Are you sure?",
    text: "Do you want to accept this user?",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, accept!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      

const statusFeedbackMap = {
  "pending": "Waiting for submission",
  "submitted": "Submitted by user",
  "reviewed": "Reviewed by admin",
  "screening-interview": "Scheduled for screening interview",
  "technical-interview": "Scheduled for technical interview",
  "final-hr-interview": "Scheduled for final HR interview",
  "team-matching": "Matching with team",
  "accepted": "Accepted by admin",
  "offer-letter": "Offer letter sent",
  "rejected": "Rejected by admin"
};

const feedback = statusFeedbackMap[newStatus] || "Status updated";
const currentStatus = user.status; // الحالة الحالية من الداتا
const newStatus = document.getElementById("statusSelect").value; // الحالة الجديدة من الـ select

// تحقق من صلاحية الانتقال
if (!statusOrder[currentStatus] || !statusOrder[currentStatus].includes(newStatus)) {
  Swal.fire("Invalid Transition", `Cannot change status from "${currentStatus}" to "${newStatus}"`, "error");
  return;
}
const response = await fetch(`${API_URL}/${userId}/status`, {
  method: "PUT",
  headers: {
    "Authorization": TOKEN,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    status: newStatus,
    feedback: feedback
  })
});


     if (response.ok) {
  Swal.fire("Accepted",` Admin has accepted the user with ID: ${userId}`, "success");
  await updateDashboard();
} else {
  const errorMsg = await response.text();
  console.error("Failed to update status:", errorMsg);
  Swal.fire("Error", "Failed to update status.", "error");
}
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  }
}

const statusOrder = [
  "pending",
  "submitted",
  "reviewed",
  "screening-interview",
  "technical-interview",
  "final-hr-interview",
  "team-matching",
  "accepted",
  "rejected",
  "offer-letter"
];
async function viewDetails(userId) {
  const user = usersData.find((u) => u.id === userId);
  if (!user) return;

 const currentIndex = statusOrder.indexOf(user.status);
const filteredStatuses = statusOrder.slice(currentIndex);

const html = `
  <p><strong>ID:</strong> ${user.id}</p>
  <p><strong>Name:</strong> ${user.user?.name || "N/A"}</p>
  <p><strong>Email:</strong> ${user.user?.email || "N/A"}</p>
  <p><strong>Created At:</strong> ${user.created_at || "N/A"}</p>
  <p><strong>Resume:</strong> <a href="${user.resume_path}" target="_blank">Download CV</a></p>
  <p><strong>Job Title:</strong> ${user.job?.title || "N/A"}</p>
  <p><strong>Salary:</strong> ${user.job?.salary || "N/A"}</p>

  <label><strong>Status:</strong></label>
  <select id="statusSelect" class="swal2-select">
    ${filteredStatuses.map(status => `
      <option value="${status}" ${user.status === status ? "selected" : ""}>${status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
    `).join('')}
  </select>
`;


  const result = await Swal.fire({
    title: ` Details for ${user.user?.name || "User"}`,
    html: html,
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const newStatus = document.getElementById("statusSelect").value;
      return { status: newStatus };
    },
    width: 600,
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`${API_URL}/${user.id}/status`, {
        method: "PUT",
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          status: result.value.status,
          feedback: "Updated from details modal",
        }),
      });

      if (response.ok) {
        Swal.fire("Saved!", "Status updated successfully.", "success");
        await updateDashboard();
      } else {
        Swal.fire("Error!", "Failed to update status.", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  }
}

function searchUsers() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filtered = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchValue)
  );
  populateTable(filtered);
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function loadUserProfile() {
  const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage");

  if (username) {
    document.querySelector(".user-profile span").textContent =
      "Hi, " + username;
    document.querySelector(".user-info h3").textContent = username;
  }

  const img = document.querySelector(".user-profile img");
  if (img) {
    img.src =
      profileImage || "./images/pngtree-vector-users-icon-png-image_856952.jpg";
  }
}

function setupNotifications() {
  const bellIcon = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  const viewAllLink = document.querySelector(".view-all");

  if (bellIcon) {
    bellIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".notification-container")) {
      dropdown.style.display = "none";
    }
  });

  document.querySelector(".mark-read")?.addEventListener("click", function () {
    document
      .querySelectorAll(".unread")
      .forEach((item) => item.classList.remove("unread"));
    const badge = document.querySelector(".notification-badge");
    if (badge) badge.textContent = "0";
  });

  viewAllLink?.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = this.getAttribute("href");
  });
}


document.addEventListener('DOMContentLoaded', function () {
    const bellIcon = document.getElementById('notificationBell');
    const dropdown = document.getElementById('notificationDropdown');
    const viewAllLink = document.querySelector('.view-all');

    // إظهار / إخفاء قائمة الإشعارات عند الضغط على الجرس
    bellIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // إغلاق القائمة إذا تم النقر خارجها
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.notification-container')) {
            dropdown.style.display = 'none';
        }
    });

    // عند الضغط على "View all" يتم التوجيه للصفحة
    viewAllLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
    });
});