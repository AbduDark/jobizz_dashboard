


// add hovered class to selected list item
let list = document.querySelectorAll(".sidebar li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));




function showTab(tabId) {
    let tabs = document.querySelectorAll(".tab-content");
    let tabButtons = document.querySelectorAll(".tab");

    tabs.forEach(tab => tab.classList.add("hidden"));
    tabButtons.forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabId).classList.remove("hidden");
    let activeButton = document.querySelector(`.tab[onclick="showTab('${tabId}')"]`);
            if (activeButton) {
                activeButton.classList.add("active");
            }
}

function addAdmin() {
    let adminName = document.getElementById("newAdmin").value;
    let adminList = document.getElementById("adminList");

    if (adminName.trim() !== "") {
        let option = document.createElement("option");
        option.text = adminName;
        adminList.add(option);
        document.getElementById("newAdmin").value = "";
    }
}

function removeAdmin() {
    let adminList = document.getElementById("adminList");
    if (adminList.selectedIndex > 0) {
        adminList.remove(adminList.selectedIndex);
    }
}



document.getElementById("logo").addEventListener("change", function() {
    let fileName = this.files.length > 0 ? this.files[0].name : "No file selected";
    document.getElementById("file-name").textContent = fileName;});
        // ✅ وظيفة فتح وإغلاق السايد بار
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');

    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
        container.style.marginLeft = "220px";
        container.style.width = "calc(100% - 220px)";
    } else {
        container.style.marginLeft = "80px";
        container.style.width = "calc(100% - 80px)";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const adminInput = document.getElementById("newAdmin");
    const adminList = document.getElementById("adminList");

    function addAdmin() {
        let adminName = adminInput.value.trim();
        if (adminName === "") return;

        let option = document.createElement("option");
        option.text = adminName;
        option.value = adminName;
        adminList.appendChild(option);
        adminInput.value = "";
    }

    function removeAdmin() {
        if (adminList.selectedIndex > 0) {
            adminList.remove(adminList.selectedIndex);
        }
    }

    document.querySelector("button[onclick='addAdmin()']").addEventListener("click", addAdmin);
    document.querySelector("button[onclick='removeAdmin()']").addEventListener("click", removeAdmin);
});

// بيانات وهمية لمحاكاة API
let settings = {
    application_name: "My Dashboard",
    logo_name: "default-logo.png",
    admins: [{ id: 1, name: "Admin1" }, { id: 2, name: "Admin2" }]
};

// ✅ محاكاة جلب البيانات من API
async function fetchSettings() {
    return new Promise(resolve => {
        setTimeout(() => resolve(settings), 500); // محاكاة التأخير كما لو كان API حقيقي
    });
}

// ✅ محاكاة تحديث الإعدادات
async function updateSettings(newSettings) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (newSettings.application_name) settings.application_name = newSettings.application_name;
            if (newSettings.logo_name) settings.logo_name = newSettings.logo_name;
            resolve({ message: "Settings updated successfully", settings });
        }, 500);
    });
}

// ✅ محاكاة إضافة مشرف جديد
async function addAdmin(name) {
    return new Promise(resolve => {
        if (!name.trim()) return;
        setTimeout(() => {
            const newAdmin = { id: settings.admins.length + 1, name };
            settings.admins.push(newAdmin);
            resolve({ message: "Admin added successfully", admin: newAdmin });
        }, 500);
    });
}

// ✅ محاكاة حذف مشرف
async function removeAdmin(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            settings.admins = settings.admins.filter(admin => admin.id !== id);
            resolve({ message: "Admin removed successfully" });
        }, 500);
    });
}

// ✅ تحديث واجهة المستخدم بعد جلب البيانات
async function loadSettings() {
    const data = await fetchSettings();

    document.querySelector('input[placeholder="Enter application name"]').value = data.application_name || '';
    document.getElementById('file-name').innerText = data.logo_name || 'No file selected';

    const adminList = document.getElementById('adminList');
    adminList.innerHTML = '<option>Select an Admin</option>';

    data.admins.forEach(admin => {
        const option = document.createElement('option');
        option.value = admin.id;
        option.textContent = admin.name;
        adminList.appendChild(option);
    });
}

// ✅ عند تحميل الصفحة، جلب البيانات وتحديث الصفحة
window.onload = loadSettings;

// ✅ التعامل مع زر إضافة مشرف
document.querySelector("button[onclick='addAdmin()']").addEventListener("click", async () => {
    const adminName = document.getElementById("newAdmin").value.trim();
    if (!adminName) return;

    await addAdmin(adminName);
    loadSettings(); // إعادة تحميل البيانات بعد التعديل
    document.getElementById("newAdmin").value = "";
});

// ✅ التعامل مع زر حذف مشرف
document.querySelector("button[onclick='removeAdmin()']").addEventListener("click", async () => {
    const adminId = parseInt(document.getElementById("adminList").value);
    if (!adminId) return;

    await removeAdmin(adminId);
    loadSettings(); // إعادة تحميل البيانات بعد الحذف
});


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



   