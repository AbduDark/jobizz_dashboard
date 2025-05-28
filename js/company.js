// Sidebar highlighting
let list = document.querySelectorAll(".sidebar li");
function activeLink() {
  list.forEach((item) => item.classList.remove("hovered"));
  this.classList.add("hovered");
}
list.forEach((item) => item.addEventListener("mouseover", activeLink));

// API Constants
const API_BASE = "https://jobizaa.com/api/admin/companies";
const TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0Njg4NDg4NSwibmJmIjoxNzQ2ODg0ODg1LCJqdGkiOiJKNFRQNDc0VDBYZmVkbHZSIiwic3ViIjoiMSIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2UtYWxsLWNvbXBhbmllcyIsIm1hbmFnZS1hbGwtam9icyIsIm1hbmFnZS1yb2xlcyIsIm1hbmFnZS1jb21wYW55LWFkbWlucyIsIm1hbmFnZS1hcHBsaWNhdGlvbnMiLCJ2aWV3LWFwcGxpY2FudC1wcm9maWxlcyIsInNlbmQtbWVzc2FnZXMiXSwiY29tcGFueV9pZCI6bnVsbH0.1okzsacodT2LkZoDo6e7N8nkNekwXxvFAuT1mjH0OE0";

document.addEventListener("DOMContentLoaded", fetchCompanies);

// @desc    Fetch companies
// @route   GET /companies
// @auhtor  A.A
let companies = [];
async function fetchCompanies() {
  try {
    const response = await fetch(API_BASE, {
      headers: {
        Authorization: TOKEN,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Swal.fire("Error", "Failed to fetch companies", "error");
      return;
    }

    const apiResult = await response.json();
    console.log(apiResult.data);

    // console.log("companies:", Object.values(apiResult)[2]["items"]);

    if (!apiResult || !Array.isArray(apiResult.data)) {
      console.error("Unexpected structure:", apiResult.data);
      Swal.fire("Error", "Invalid data format received from API", "error");
      return;
    }

    // console.log("Full API Response:", apiResult);
    const items = apiResult.data;

    const companies = items.map((company) => ({
      id: company.id ?? 0,
      name: company.name ?? "N/A",
      logo: company.logo ?? "",
      email: company.email ?? "N/A", // لو فيه email
      jobs: company.jobs_count ?? 0, // لو فيه jobs_count
      status: Math.random() > 0.5 ? "Active" : "Inactive",
    }));

    displayCompanies(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    Swal.fire(
      "Error",
      "Something went wrong while fetching companies",
      "error"
    );
  }
}

// Add a company
async function addCompany(formData) {
  try {
    const response = await fetch(`${API_BASE}` / add - company, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to add company");

    await fetchCompanies();
  } catch (error) {
    console.error("Error adding company:", error);
  }
}

// Update company
async function updateCompany(id, formData) {
  formData.append("_method", "PUT");

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update company");

    await fetchCompanies();
  } catch (error) {
    console.error("Error updating company:", error);
  }
}

// Delete company
async function deleteCompany(id) {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirm.isConfirmed) {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: TOKEN,
          Accept: "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`Failed to delete company with id ${id}`);

      companies = companies.filter((c) => c.id !== id);
      displayCompanies();

      Swal.fire(
        "Deleted!",
        "Company has been deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  }
}

// Change company status (local only)
function changeStatus(id, newStatus) {
  companies = companies.map((company) =>
    company.id === id ? { ...company, status: newStatus } : company
  );
  displayCompanies();
}

// Display companies
function displayCompanies(companiesList = []) {
  const tableBody = document.getElementById("companyTableBody");
  const companyListContainer = document.getElementById("companyList");

  // Check if HTML elements exist
  if (!tableBody || !companyListContainer) {
    console.error(
      "Missing DOM elements with IDs: companyTableBody or companyList"
    );
    return;
  }

  tableBody.innerHTML = "";
  companyListContainer.innerHTML = "";

  if (companiesList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No companies found</td></tr>`;
    return;
  }

companiesList.forEach((company) => {
  const row = document.createElement("tr");
row.innerHTML = `
  <td><img src="${company.logo}" alt="Logo" style="width:50px;height:auto;"></td>
  <td>${company.name || "N/A"}</td>
  <td>${company.description || "N/A"}</td>
  <td><a href="${company.website}" target="_blank">Visit</a></td>
  <td>${company.status || "N/A"}</td>
         <button class="delete-btn" onclick="deleteCompany(${company.id})">Delete</button>

`;

    tableBody.appendChild(row);

    // Card view
    const item = document.createElement("div");
    item.classList.add("company-item");
    item.innerHTML = `
      <label>Company Name:</label><p>${company.name}</p>
      <label>Email:</label><p>${company.email}</p>
      <label>Job Count:</label><p>${company.jobs}</p>
      <label>Status:</label><p>${company.status}</p>
      <div class="actions">
        <button class="delete-btn" onclick="deleteCompany(${company.id})">Delete</button>
      </div>
    `;
    companyListContainer.appendChild(item);
  });

  // Optional: switch between table and card display
  if (typeof updateDisplayMode === "function") {
    updateDisplayMode();
  }
}

// Filter companies
function filterCompanies() {
  let status = document.getElementById("statusFilter").value;
  let jobCount = document.getElementById("jobsFilter").value;

  let filtered = companies.filter(
    (company) =>
      (status === "" || company.status === status) &&
      (jobCount === "" || company.jobs >= jobCount)
  );

  displayCompanies(filtered);
}

function updateDisplayMode() {
  let table = document.querySelector("table");
  let companyListContainer = document.getElementById("companyList");

  if (window.innerWidth <= 768) {
    table.style.display = "none";
    companyListContainer.style.display = "block";
  } else {
    table.style.display = "table";
    companyListContainer.style.display = "none";
  }
}

window.addEventListener("resize", updateDisplayMode);
window.onload = () => fetchCompanies();


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
   


      // Add this script to your navigation pages (like job.html, about.html, etc.)
// This should be included near the top of your JS scripts

document.addEventListener("DOMContentLoaded", function() {
    // Check authentication and access control
    function checkAccess() {
        const authToken = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("userRole");
        
        // If not logged in at all, redirect to login
        if (!authToken) {
            window.location.href = "login.html";
            return;
        }
        
        // Get current page
        const currentPage = window.location.pathname.split("/").pop();
        
        // List of pages accessible to regular users
        const userAccessiblePages = [
            "newpass.html", 
            "signup.html", 
            "job.html", 
            "company.html", 
            "profile.html"
        ];
        
        // Check if regular user is trying to access restricted page
        if (userRole === "user" && !isPageAccessible(currentPage, userAccessiblePages)) {
            // Redirect to allowed page or show access denied
            alert("Access denied. You don't have permission to view this page.");
            window.location.href = "job.html"; // Redirect to an allowed page
        }
    }
    
    // Check if the current page is in the allowed list
    function isPageAccessible(page, allowedPages) {
        return allowedPages.some(allowedPage => 
            page === allowedPage || page === "" && allowedPage === "job.html"
        );
    }
    
    // Run access check
    checkAccess();
    
    // Modify navigation menu visibility based on role
    function updateNavigation() {
        const userRole = localStorage.getItem("userRole");
        
        // If we're on a page with sidebar navigation
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            const menuItems = sidebar.querySelectorAll("li");
            
            if (userRole === "user") {
                // Hide admin-only menu items from regular users
                menuItems.forEach(item => {
                    const linkText = item.querySelector(".text")?.textContent.trim().toLowerCase();
                    
                    // Define which menu items should be hidden from regular users
                    const adminOnlyItems = ["dashboard", "users", "view jobs", "settings"];
                    
                    if (adminOnlyItems.includes(linkText)) {
                        item.style.display = "none";
                    }
                });
            }
        }
    }
    
    // Update navigation elements
    updateNavigation();
});