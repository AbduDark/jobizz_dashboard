// Set your authorization token here
const TOKEN = "Bearer " + sessionStorage.getItem("token");
// Load and display all blacklisted admins
async function loadBlacklist() {
  try {
    const response = await fetch('https://jobizaa.com/api/admin/black-list', {
      headers: {
        'Authorization': TOKEN,
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
