// Parse JWT token to extract role
function parseRole(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || (payload.roles && payload.roles[0]) || null;
  } catch {
    return null;
  }
}

// Protect a page by allowed roles
function protectPage(allowedRoles = []) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return window.location.href = "login.html";
  }

  const role = parseRole(token);
  if (!role || !allowedRoles.includes(role)) {
    const accessDeniedDiv = document.getElementById("access-denied");
    if (accessDeniedDiv) {
      accessDeniedDiv.style.display = "block";
      accessDeniedDiv.textContent = "🚫 Access Denied Only for super admin";
    } else {
      window.location.href = "unauthorized.html";
    }
  }
}

// Control visibility of elements based on role
function toggleVisibilityByRole(role) {
  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = role === "super-admin" ? "block" : "none";
  });

  document.querySelectorAll(".user-only").forEach(el => {
    el.style.display = ["admin", "super-admin"].includes(role) ? "block" : "none";
  });
}

// Restrict admin from accessing certain pages
function restrictAdminPages(role) {
  const allowedPagesForAdmin = ["job.html", "view.html", "profile.html", "chat.html"];
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (role === "admin" && !allowedPagesForAdmin.includes(currentPage)) {
    const accessDeniedDiv = document.getElementById("access-denied");
    if (accessDeniedDiv) {
      accessDeniedDiv.style.display = "block";
      accessDeniedDiv.textContent = "🚫 Access Denied Only for super admin";
    } else {
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div id="access-denied" style="
          background: #ffe0e0;
          color: #d8000c;
          padding: 15px;
          text-align: center;
          font-weight: bold;
        "> Access Denied Only for super admin🚫</div>`
      );
    }
  }
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) return window.location.href = "login.html";

  const role = parseRole(token);
  if (!role) return window.location.href = "unauthorized.html";

  // Optional: Apply page protection
  protectPage(["admin", "super-admin"]);

  // Control visibility of elements
  toggleVisibilityByRole(role);

  // Restrict admin from some pages
  restrictAdminPages(role);
});

// Export functions globally if needed
window.protect = { protectPage };
window.protectPage = protectPage;
window.parseRole = parseRole;