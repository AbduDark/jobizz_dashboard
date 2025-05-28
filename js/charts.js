const application_token="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0NzMxNzIxMiwibmJmIjoxNzQ3MzE3MjEyLCJqdGkiOiJCY1JoRUsyZDJ3akxUbmxnIiwic3ViIjoiMyIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJhZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2Utb3duLWNvbXBhbnkiLCJtYW5hZ2UtY29tcGFueS1qb2JzIiwibWFuYWdlLWNvbXBhbnktYWRtaW5zIiwibWFuYWdlLWFwcGxpY2F0aW9ucyIsInZpZXctYXBwbGljYW50LXByb2ZpbGVzIiwic2VuZC1tZXNzYWdlcyJdLCJjb21wYW55X2lkIjozfQ.997-fwY_-3zLs2rd43YWnZEJ8HWLq4OoT8btXDMduoU"
const users_token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0NzE3MzI1MSwibmJmIjoxNzQ3MTczMjUxLCJqdGkiOiJNNXNHU0lBNDZMa1AwM0wwIiwic3ViIjoiMSIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2UtYWxsLWNvbXBhbmllcyIsIm1hbmFnZS1hbGwtam9icyIsIm1hbmFnZS1yb2xlcyIsIm1hbmFnZS1jb21wYW55LWFkbWlucyIsIm1hbmFnZS1hcHBsaWNhdGlvbnMiLCJ2aWV3LWFwcGxpY2FudC1wcm9maWxlcyIsInNlbmQtbWVzc2FnZXMiXSwiY29tcGFueV9pZCI6bnVsbH0.X2ezIVql0YUgkruYV058QG8NpyHzAZSdHv60zAA_9R0"
const job_token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc0NzE1Mzc3NywibmJmIjoxNzQ3MTUzNzc3LCJqdGkiOiI2QzBzVXo2NEl1b2VWQk9sIiwic3ViIjoiMSIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkiLCJyb2xlcyI6WyJzdXBlci1hZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJtYW5hZ2UtYWxsLWNvbXBhbmllcyIsIm1hbmFnZS1hbGwtam9icyIsIm1hbmFnZS1yb2xlcyIsIm1hbmFnZS1jb21wYW55LWFkbWlucyIsIm1hbmFnZS1hcHBsaWNhdGlvbnMiLCJ2aWV3LWFwcGxpY2FudC1wcm9maWxlcyIsInNlbmQtbWVzc2FnZXMiXSwiY29tcGFueV9pZCI6bnVsbH0.lllND3CQfb9WYSeWLrcC2MqyUCmkeZiCZ5k1Tqfrwic"
const ctx1 = document.getElementById("chart-1").getContext("2d");
const myChart1 = new Chart(ctx1, {
  type: "pie",
  data: {
    labels: ["Registered", "Pending"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#36A2EB", "#FF6384"],
    }],
  },
  options: { responsive: true },
});

// ✅ chart-2: عدد التطبيقات حسب الوظائف
const ctx2 = document.getElementById("chart-2").getContext("2d");
const myChart2 = new Chart(ctx2, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Applications",
      data: [],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
    }],
  },
  options: { responsive: true },
});

// ✅ chart-3: بيانات تجريبية - يمكن استبدالها لاحقًا
const ctx3 = document.getElementById("chart-3").getContext("2d");
const myChart3 = new Chart(ctx3, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{
      label: "Applications",
      data: [10, 20, 15, 25, 30],
      borderColor: "red",
      borderWidth: 1,
      fill: false,
    }],
  },
  options: { responsive: true },
});

// ✅ chart-4: إحصائيات الوظائف
const ctx4 = document.getElementById("chart-4").getContext("2d");
const myChart4 = new Chart(ctx4, {
  type: "doughnut",
  data: {
    labels: ["Active Jobs", "Inactive Jobs", "New Jobs"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
    }],
  },
  options: { responsive: true },
});

// ✅ updateChart1: تحميل بيانات المستخدمين
async function updateChart1() {
  try {
    const res = await fetch("https://jobizaa.com/api/admin/users", {
      headers: {
        Authorization: users_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const users = data?.data?.users || [];
    const registered = users.filter(u => u.confirmed_email).length;
    const pending = users.length - registered;

    myChart1.data.datasets[0].data = [registered, pending];
    myChart1.update();
  } catch (err) {
    console.error("updateChart1 error:", err);
  }
}

// ✅ updateChart2: تحميل بيانات التطبيقات
async function updateChart2() {
  try {
    const res = await fetch("https://jobizaa.com/api/admin/applications", {
      headers: {
        Authorization: application_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const apps = data?.data?.applications || [];

    const countMap = {};
    apps.forEach(app => {
      const title = app.job?.title || "Unknown";
      countMap[title] = (countMap[title] || 0) + 1;
    });

    myChart2.data.labels = Object.keys(countMap);
    myChart2.data.datasets[0].data = Object.values(countMap);
    myChart2.update();
  } catch (err) {
    console.error("updateChart2 error:", err);
  }
}
async function updateChart3() {
  try {
    const res = await fetch("https://jobizaa.com/api/admin/applications", {
      headers: {
        Authorization: application_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const apps = data?.data?.applications || [];

    // تجميع حسب التاريخ
    const dateMap = {};

    apps.forEach(app => {
      const date = new Date(app.created_at).toISOString().split("T")[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    // ترتيب حسب التاريخ (أحدث 7 أيام)
    const sortedDates = Object.keys(dateMap).sort().slice(-7);
    const values = sortedDates.map(date => dateMap[date]);

    myChart3.data.labels = sortedDates;
    myChart3.data.datasets[0].data = values;
    myChart3.update();
  } catch (err) {
    console.error("updateChart3 error:", err);
  }
}
// ✅ updateChart4: تحميل بيانات الوظائف
async function updateChart4() {
  try {
    const res = await fetch("https://jobizaa.com/api/admin/jobs", {
      headers: {
        Authorization: job_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const jobs = data?.data?.jobs || [];
    const now = new Date();
    let active = 0, inactive = 0, recent = 0;

    jobs.forEach(job => {
      const created = new Date(job.created_at);
      const days = (now - created) / (1000 * 60 * 60 * 24);
      if (job.job_status === "open") active++;
      else inactive++;
      if (days <= 7) recent++;
    });

    myChart4.data.datasets[0].data = [active, inactive, recent];
    myChart4.update();
  } catch (err) {
    console.error("updateChart4 error:", err);
  }
}

// ✅ تشغيل التحديث التلقائي عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  updateChart1();
  updateChart2();
  updateChart3();
  updateChart4();
});