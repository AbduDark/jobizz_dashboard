// js/js/index.js

document.addEventListener("DOMContentLoaded", function() {


  // ثم بقية الكود (fetchData, fetchJobsForOrders...)
  const API_URL = "https://jobizaa.com/api/admin";
  const TOKEN   = "Bearer " + auth.getToken();

  async function fetchData() {
    try {
      const [uR, cR, jR] = await Promise.all([
        fetch(`${API_URL}/users`,    { headers:{ Authorization:TOKEN } }),
        fetch(`${API_URL}/companies`,{ headers:{ Authorization:TOKEN } }),
        fetch(`${API_URL}/jobs`,     { headers:{ Authorization:TOKEN } })
      ]);

      const users    = await uR.json();
      const companies= await cR.json();
      const jobs     = await jR.json();
      document.getElementById("userCount").textContent    = users.data.users.length;
      document.getElementById("activeUser").textContent   = users.data.users.length;
      document.getElementById("companyCount").textContent = companies.data.length;
      document.getElementById("jobCount").textContent     = jobs.data.jobs.length;
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchJobsForOrders() {
    try {
      const res  = await fetch(`${API_URL}/jobs?page=1&limit=5`, { headers:{ Authorization:TOKEN } });
      const body = await res.json();
      const list = body.data.jobs?.data || body.data.jobs || [];
      const tbody = document.getElementById("orders-data");
      tbody.innerHTML = "";

      if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="6">No jobs found.</td></tr>`;
        return;
      }

      list.forEach(job => {
        const randPrice = Math.floor(Math.random()*5000)+1000;
        const randDate  = new Date(Date.now()-Math.random()*30*86400000)
                            .toLocaleDateString('en-US',{ year:'numeric', month:'short', day:'numeric' });
        const methods   = ["Credit Card","PayPal","Bank Transfer","Cash"];
        const pay       = methods[Math.floor(Math.random()*methods.length)];
        let statusClass = 'pending-status';
        const st = (job.job_status||job.status||"").toLowerCase();
        if (st==='open'||st==='accepted') statusClass='active-status';
        if (st==='closed'||st==='rejected') statusClass='rejected-status';

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${job.id}</td>
          <td>${job.title||"Untitled Job"}</td>
          <td>${randDate}</td>
          <td>$${randPrice}</td>
          <td><span class="${statusClass}">${job.job_status||job.status||"Pending"}</span></td>
          <td>${pay}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      document.getElementById("orders-data").innerHTML =
        `<tr><td colspan="6">Error loading job data.</td></tr>`;
    }
  }

  fetchData();
  fetchJobsForOrders();
  if (typeof initCharts === 'function') initCharts();
});
