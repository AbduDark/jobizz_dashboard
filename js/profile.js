  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("companyForm");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const website = document.getElementById("website").value.trim();
      const description = document.getElementById("description").value.trim();
      const size = document.getElementById("size").value;
      const hiredPeople = document.getElementById("hired_people").value;
      const location = document.getElementById("location").value.trim();
      const logoInput = document.getElementById("companylogo");

      const authToken = sessionStorage.getItem("token");

      if (!authToken) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to add a company.',
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("website", website);
      formData.append("description", description);
      formData.append("size", size);
      formData.append("hired_people", hiredPeople);
      formData.append("location", location);

      if (logoInput.files.length > 0) {
        formData.append("companylogo", logoInput.files[0]);
      }

      try {
        const response = await fetch("https://jobizaa.com/api/admin/companies/add-company", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
          body: formData,
        });

        const result = await response.json();
        console.log("API Response:", result);

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Company has been added successfully!',
          }).then(() => {
            window.location.href = "view.html";
          });
        } else {
          let errorMessage = result.message || 'Failed to save company data.';
          if (result.errors) {
            const errors = Object.values(result.errors).flat().join('<br>');
            errorMessage = errors;
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: errorMessage
          });
        }

      } catch (error) {
        console.error("Network error:", error);
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Please try again later.",
        });
      }
    });
  });
