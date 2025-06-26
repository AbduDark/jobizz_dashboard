// Set your authorization token here
const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYml6YWEuY29tL2FwaS9hZG1pbi9sb2dpbiIsImlhdCI6MTc1MDUxNzg4MCwibmJmIjoxNzUwNTE3ODgwLCJqdGkiOiJWVWFDdkFvS0RmVkFIckpVIiwic3ViIjoiOTAiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5Iiwicm9sZXMiOlsic3VwZXItYWRtaW4iXSwicGVybWlzc2lvbnMiOlsibWFuYWdlLWFsbC1jb21wYW5pZXMiLCJtYW5hZ2UtYWxsLWpvYnMiLCJtYW5hZ2Utcm9sZXMiLCJtYW5hZ2UtY29tcGFueS1hZG1pbnMiLCJtYW5hZ2UtYXBwbGljYXRpb25zIiwidmlldy1hcHBsaWNhbnQtcHJvZmlsZXMiLCJzZW5kLW1lc3NhZ2VzIl0sImNvbXBhbnlfaWQiOm51bGx9.ltFRHWBuBJWSlSYM_iLFP3sXsrTr9anrbBf_NU8npVM'; // Replace this with your actual token

// Load and display all blacklisted admins
async function loadBlacklist() {
  try {
    const response = await fetch('https://jobizaa.com/api/admin/black-list', {
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log("API Response:", result);

    const admins = result?.data?.data;

    if (!Array.isArray(admins)) {
      alert('Unexpected response format from API.');
      return;
    }

    const tbody = document.querySelector('#blacklistTable tbody');
    tbody.innerHTML = '';

    admins.forEach(admin => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${admin.id_of_block_admin}</td>
        <td>${admin.name}</td>
        <td>${admin.phone || '-'}</td>
        <td>${admin.email || '-'}</td>
        <td>
          <button onclick="unblockAdmin(${admin.id_of_block_admin}, this)">Unblock</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    alert('Error loading blacklist: ' + error.message);
  }
}


// Unblock a specific admin by ID
async function unblockAdmin(id, button) {
  if (!confirm('Are you sure you want to unblock this admin?')) return;

  button.disabled = true;
  const originalText = button.textContent;
//   button.textContent = 'Unblocking...';

  console.log(`Sending request to: https://jobizaa.com/api/admin/approve/${id}`);


   try {
    const res = await fetch(`https://jobizaa.com/api/admin/approve/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

     if (res.ok) {
      console.log('✅ Admin unblocked successfully.');
      loadBlacklist(); // Reload the table
    } else {
      console.error(' Failed to unblock admin. Response status:', res.status);
      button.disabled = false;
      button.textContent = originalText;
    }

  } catch (error) {
    console.error(' Error unblocking admin:', error);
    button.disabled = false;
    button.textContent = originalText;
  }
}
document.addEventListener('DOMContentLoaded', loadBlacklist);
