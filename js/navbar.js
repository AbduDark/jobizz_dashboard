document.addEventListener("DOMContentLoaded", async () => {
  const company_id = sessionStorage.getItem("company_id");
  if (!company_id) return;

  try {
    const super_token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0NzE3MzI1MSwibmJmIjoxNzQ3MTczMjUxLCJqdGkiOiJNNXNHU0lBNDZMa1AwM0wwIiwic3ViIjoiMSIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2UtYWxsLWNvbXBhbmllcyIsIm1hbmFnZS1hbGwtam9icyIsIm1hbmFnZS1yb2xlcyIsIm1hbmFnZS1jb21wYW55LWFkbWlucyIsIm1hbmFnZS1hcHBsaWNhdGlvbnMiLCJ2aWV3LWFwcGxpY2FudC1wcm9maWxlcyIsInNlbmQtbWVzc2FnZXMiXSwiY29tcGFueV9pZCI6bnVsbH0.X2ezIVql0YUgkruYV058QG8NpyHzAZSdHv60zAA_9R0"; // حط التوكن الحقيقي هنا
    const res = await fetch(`https://jobizaa.com/api/admin/companies/${company_id}`, {
      method: "GET",
      headers: {
        Authorization: super_token  , // حط التوكن الصحيح هنا
        Accept: "application/json"
      }
    });

    const data = await res.json();

    const company = data?.data?.company;
    const activeJobsCount = data?.data?.active_jobs ?? 0; // عدد الوظائف النشطة من الريسبونس

    if (!company) return;

    const companyNameEl = document.getElementById("companyName");
    const companyNameFullEl = document.getElementById("companyFullName");
    const companyWebsiteEl = document.getElementById("companyWebsite");
    const companyLogoEl = document.getElementById("companyLogo");

    if (companyNameEl) companyNameEl.textContent = company.name || "N/A";

    if (companyNameFullEl) {
      companyNameFullEl.textContent = `Active Jobs: ${activeJobsCount}`;
    }

    if (companyWebsiteEl) {
      companyWebsiteEl.textContent = company.website || "N/A";
      companyWebsiteEl.href = company.website || "#";
    }

    if (companyLogoEl) companyLogoEl.src = company.logo || "assets/images/avata.jpeg";

  } catch (err) {
    console.error("فشل في تحميل بيانات الشركة:", err);
  }
});

