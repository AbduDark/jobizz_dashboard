
console.log("company_id in sessionStorage:", sessionStorage.getItem("company_id"));
  // حماية الصفحة للـ super-admin و admin
  
  // ربط زرّ الخروج


  
function toggleDropdown() {

    document.querySelector(".user-profile").classList.toggle("active");

}

// ✅ إغلاق القائمة عند الضغط خارجها
document.addEventListener("click", function (event) {
    let profile = document.querySelector(".user-profile");
    if (!profile.contains(event.target)) {
        profile.classList.remove("active");
    }
});


// Ens logic in header

// ##########################################################


// start logic sidebar

let toggle = document.querySelector(".toggle-btn");

let sidebar = document.querySelector(".sidebar");


let topBar = document.querySelector(".top-bar");
let mainPanel = document.querySelector(".main-panel");


toggle.addEventListener("click", function () {

    sidebar.classList.toggle('open');
    topBar.classList.toggle('open');

    mainPanel.classList.toggle('open');

});



document.addEventListener('DOMContentLoaded', function () {
    const listItems = document.querySelectorAll(".sidebar li");
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    listItems.forEach(item => {
        const link = item.querySelector('a').getAttribute('href');
        item.classList.toggle('active-link', link === currentPage);

        item.addEventListener('click', function () {
            listItems.forEach(li => li.classList.remove('active-link'));
            this.classList.add('active-link');
        });
    });
});

// end logic sidebar

// ##########################################################
// تبديل عرض الإشعارات
document.getElementById('notificationBell').addEventListener('click', function(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// إغلاق الدروبداون عند النقر خارجها
document.addEventListener('click', function(e) {
    if (!e.target.closest('.notification-container')) {
        document.getElementById('notificationDropdown').style.display = 'none';
    }
});

// تحديد كل الإشعارات كمقروءة
document.querySelector('.mark-read').addEventListener('click', function() {
    document.querySelectorAll('.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').textContent = '0';
});



document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (username) {
        document.querySelector(".user-profile span").textContent = "Hi, " + username;
        document.querySelector(".user-info h3").textContent = username;
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const imgElement = document.querySelector(".user-profile img");
    const profileImage = localStorage.getItem("profileImage");

    if (imgElement) {
        if (profileImage) {
            imgElement.src = profileImage;
        } else {
            imgElement.src = "./images/pngtree-vector-users-icon-png-image_856952.jpg"; // صورة افتراضية عند الحذف
        }
    }
});



    const map = L.map('world-map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const fakeApiData = [
        { name: "user1", lat: 30.0444, lon: 31.2357, country: "Egypt" },
        { name: "user2", lat: 40.7128, lon: -74.0060, country: "America" },
        { name: "user3", lat: 48.8566, lon: 2.3522, country:" France" },
        { name: "user4", lat: 51.5074, lon: -0.1278, country: "Britain" },
        { name: "user5", lat: 35.6895, lon: 139.6917, country: "Japan" }
    ];

    let markers = [];

    function loadUserLocations() {
        clearMapMarkers(); // تنظيف أي علامات قديمة
        fakeApiData.forEach(user => {
            const marker = L.marker([user.lat, user.lon]).addTo(map);
            marker.bindPopup(`<b>${user.name}</b><br>country: ${user.country}`);
            markers.push(marker);
        });
    }

    function clearMapMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }

  const bell = document.getElementById('notificationBell');
  const dropdown = document.getElementById('notificationDropdown');

  bell.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // إغلاق القائمة عند النقر خارجها
  window.addEventListener('click', (e) => {
    if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });