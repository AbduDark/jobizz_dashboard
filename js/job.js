// General Settings
const API_URL = "https://jobizaa.com/api/admin/jobs";

const TOKEN = "Bearer " + sessionStorage.getItem('token');

let jobs = [];
let currentPage = 1;
const itemsPerPage = 5;

// Load jobs on page load
document.addEventListener("DOMContentLoaded", fetchJobs);

// @desc    Toggle Notification
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

// @author  A.A
// @desc    Fetch jobs from API
// @route   GET /api/admin/jobs
async function fetchJobs() {
  document.getElementById("loading").style.display = "block";
  try {
    const response = await fetch(
      `${API_URL}?page=${currentPage}&limit=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: TOKEN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const respons = await response.json();
    console.log("Response:", respons);

    const jobList =
      respons?.data?.jobs?.data ||
      respons?.data?.jobs ||
      respons?.jobs?.data ||
      respons?.jobs ||
      respons?.data ||
      [];

    let alljobs = [];

    if (Array.isArray(jobList) && jobList.length > 0) {
      alljobs = jobList.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || "No company",
        salary: job.salary || 0 ,
        position: job.position || "No position",
        created_at: job.created_at || "No date",
        status: job.job_status || "Pending",
      }));
    } else {
      console.warn("No jobs available");
    }
    jobs = alljobs;

    displayJobs(alljobs);

    // يمكنك استخدام alljobs هنا مثلاً:
    displayJobs(alljobs); // أو أي دالة تعرض البيانات
  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}
// View job details
function viewJob(jobId) {
  fetch(`${API_URL}/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: TOKEN,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((job) => {
      Swal.fire({
        title: job.title,
        html: `
          <p><strong>Company:</strong> ${job.description || "No company"}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Salary:</strong> ${job.salary}</p>
          <p><strong>Status:</strong> ${job.job_status}</p>
          <p><strong>position At:</strong> ${job.position}</p>
          <p><strong>Created At:</strong> ${job.created_at}</p>
        `,
        icon: "info",
      });
    })
    .catch((err) => console.error("Error fetching job details:", err));
  window.location.href = "view.html";
}

// @author  A.A
// @desc    Display Jobs in Table
// @route   GET /api/admin/jobs
function displayJobs(jobsArray) {
  const tableBody = document.getElementById("jobTable");
  tableBody.innerHTML = "";

  if (jobsArray.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No jobs found.</td></tr>`;
    return;
  }

  jobsArray.forEach((job) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${job.id}</td>
      <td>${job.title}</td>
      <td>${job.company}</td>
      <td>${job.salary}</td>
      <td>${job.status}</td>
       <td>${job.position}</td>
       <td>${job.created_at}</td>
      <td>
        <button class="view-btn btn btn-primary" onclick="viewJob(${job.id})">
          <i class="fa-solid fa-eye"></i> View
        </button>
        <button class="edit-btn btn btn-success" onclick="openEditJobModal(${job.id})">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
       <button class="delete-button btn btn-danger" data-id="${job.id}">
        <i class="fa-solid fa-trash"></i> Delete
      </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Attach the event listener to all delete buttons after the table is populated
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", function () {
      const jobId = parseInt(this.getAttribute("data-id"));
      deleteJob(jobId); 
    });
  });
}

// Generate pagination buttons
function generatePagination(totalItems) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("button");
    button.innerHTML = `<i class="fa-solid fa-circle"></i> ${i}`;
    button.onclick = () => {
      currentPage = i;
      fetchJobs();
    };
    pagination.appendChild(button);
  }
}

// Apply search and filter
function applyFilters() {
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  let statusFilter = document.getElementById("statusFilter").value;
  let filteredJobs = jobs.filter(
    (job) =>
      (job.title.toLowerCase().includes(searchValue) ||
        job.company.toLowerCase().includes(searchValue)) &&
      (statusFilter === "" ||
        job.status.toLowerCase() === statusFilter.toLowerCase())
  );
  displayJobs(filteredJobs);
}

// @author  A.A
// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
async function deleteJob(id) {
  if (!id || isNaN(id)) {
    Swal.fire("Error!", "Invalid job ID.", "error");
    return;
  }

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirm.isConfirmed) {
    try {
      console.log("Deleting job with ID:", id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          // token of creator
          Authorization: TOKEN,
        },
      });

      const result = await response.json();
      console.log("result:", result);

      if (response.status === 404) {
        Swal.fire("Error!", "Job not found or already deleted.", "error");
        return;
      }

      if (!response.ok) {
        Swal.fire("Error!", "Failed to delete job.", "error");
        return;
      }

      Swal.fire("Deleted!", "Job has been deleted.", "success");
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  }
}

// @author  A.A
// @desc    Open add job modal
function openAddJobModal() {
  document.getElementById("modalJobId").value = "";
  document.getElementById("modalCategory").value = "";
  document.getElementById("modalTitle").value = "";
  document.getElementById("modalSalary").value = "";
  document.getElementById("modalLocation").value = "";
  document.getElementById("modalDescription").value = "";
  document.getElementById("modalRequirement").value = "";
  document.getElementById("modalBenefits").value = "";
  document.getElementById("modalJob_type").value = "";
  document.getElementById("modalJob_status").value = "";
  document.getElementById("modalPosition").value = "";
  document.getElementById("modalStatus").value = "Pending"; // default value
  document.getElementById("modalTitleText").innerText = "Add Job";
  document.getElementById("jobModal").style.display = "flex";

  document.getElementById("updateButton").style.display = "none";
  document.getElementById("saveButton").style.display = "block";
}

// @author  A.A
// @desc    Open edit job modal
// @route   GET /api/admin/jobs/:id
async function openEditJobModal(id) {
  console.log("Editing job with ID:", id);
  // fetch job details from API
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: TOKEN,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Swal.fire("Error", "Failed to fetch job data", "error");
      return;
    }

    const result = await response.json();
    const job = result.data.job;
    console.log("job:", job);

    if (!job) {
      console.warn("Job not found in API response.");
      return;
    }

    document.getElementById("modalJobId").value = job.id || "";
    document.getElementById("modalCategory").value = job.category_name;
    document.getElementById("modalTitle").value = job.title || "";
    document.getElementById("modalSalary").value = job.salary || "";
    document.getElementById("modalLocation").value = job.location || "";
    document.getElementById("modalDescription").value = job.description || "";
    document.getElementById("modalRequirement").value = job.requirement || "";
    document.getElementById("modalBenefits").value = job.benefits || "";
    document.getElementById("modalJob_type").value = job.job_type || "";
    document.getElementById("modalJob_status").value = job.job_status || "";
    document.getElementById("modalPosition").value = job.position || "";
    document.getElementById("modalStatus").value = job.status || "Pending";

    document.getElementById("modalTitleText").innerText = "Edit Job";
    document.getElementById("jobModal").style.display = "flex";

    document.getElementById("saveButton").style.display = "none";
    document.getElementById("updateButton").style.display = "block";
  } catch (err) {
    console.error("Error fetching job details:", err);
    Swal.fire("Error", "Failed to fetch job data", "error");
  }
}

// @author  A.A
// @desc    Update job
// @route   POST /api/admin/jobs/:id
async function saveChanges() {
  let id = document.getElementById("modalJobId").value;
  console.log("Saving job with ID:", id);

  if (!id) {
    console.warn("Job ID is not provided.");
    return;
  }
  let category = document.getElementById("modalCategory").value;
  let title = document.getElementById("modalTitle").value;
  let salary = document.getElementById("modalSalary").value;
  let location = document.getElementById("modalLocation").value;
  let description = document.getElementById("modalDescription").value;
  let requirement = document.getElementById("modalRequirement").value;
  let benefits = document.getElementById("modalBenefits").value;
  let job_type = document.getElementById("modalJob_type").value;
  let job_status = document.getElementById("modalJob_status").value;
  let position = document.getElementById("modalPosition").value;
  let status = document.getElementById("modalStatus").value;

  const formData = new URLSearchParams();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("job_status", job_status);
  formData.append("category_name", category);
  formData.append("location", location);
  formData.append("salary", salary);
  formData.append("requirement", requirement);
  formData.append("benefits", benefits);
  formData.append("job_type", job_type);
  formData.append("status", status);
  formData.append("position", position);

  if (id) {
    formData.append("_method", "PUT");
  }

  const url = id ? `${API_URL}/${id}` : ` ${API_URL}/add-job`;

  const options = {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.status === "403") {
      Swal.fire({
        title: "Error!",
        text: "You don't have permission to perform this action.",
        icon: "error",
      });
      return;
    }
    if (result.status === "422") {
      Swal.fire({
        title: "Error!",
        text: `${result.data[0] || "Validation error."}`,
        icon: "error",
      });
      return;
    }
    console.log("Saved job:", result);
    closeModal();
    fetchJobs();
  } catch (error) {
    console.error("Error saving job:", error);
  }
}

// @author  A.A
// @desc    Create a new job
// @route   POST /api/admin/jobs/add-job
async function saveJob() {
  let id = document.getElementById("modalJobId").value;
  let category = document.getElementById("modalCategory").value;
  let title = document.getElementById("modalTitle").value;
  let salary = document.getElementById("modalSalary").value;
  let location = document.getElementById("modalLocation").value;
  let description = document.getElementById("modalDescription").value;
  let requirement = document.getElementById("modalRequirement").value;
  let benefits = document.getElementById("modalBenefits").value;
  let job_type = document.getElementById("modalJob_type").value;
  let job_status = document.getElementById("modalJob_status").value;
  let position = document.getElementById("modalPosition").value;
  let status = document.getElementById("modalStatus").value;

  const formData = new URLSearchParams();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("job_status", job_status || "Open");
  formData.append("category_name", category || "General");
  formData.append("location", location);
  formData.append("salary", salary);
  formData.append("requirement", requirement);
  formData.append("benefits", benefits);
  formData.append("job_type", job_type);
  formData.append("position", position);
  formData.append("status", status);

  const options = {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  };

  const url = id ? `${API_URL}/${id}` : `${API_URL}/add-job`;

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("Saved job:", result);
    if (result.status === "403") {
      Swal.fire({
        title: "Error!",
        text: "You don't have permission to perform this action.",
        icon: "error",
      });
      return;
    }
    if (result.status === "422") {
      Swal.fire({
        title: "Error!",
        text: `${result.data[0] || "Validation error."}`,
        icon: "error",
      });
      return;
    }
    if (result.status === "409") {
      Swal.fire({
        title: "Error!",
        text: `${result.data[0] || "Conflict error."}`,
        icon: "error",
      });
      return;
    }
    if (result.status === "200") {
      Swal.fire({
        title: "Success!",
        text: "Job created successfully.",
        icon: "success",
      });
      return;
    }

    closeModal();
    fetchJobs();
  } catch (error) {
    console.error("Error saving job:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while saving the job.",
      icon: "error",
    });
  }
}

// Close the modal
function closeModal() {
  document.getElementById("jobModal").style.display = "none";
}