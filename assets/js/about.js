document.querySelector('.toggle-btn').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const topBar = document.querySelector('.top-bar');
    const wrapper = document.querySelector('.wrapper');
    sidebar.classList.toggle('open');
    topBar.classList.toggle('open');
    wrapper.classList.toggle('content-shift');
});

// تفعيل القائمة المنسدلة للمستخدم
function toggleDropdown() {
    document.querySelector('.user-profile').classList.toggle('active');
}

// إغلاق القوائم عند النقر خارجها
window.onclick = function(event) {
    if (!event.target.closest('.user-profile')) {
        let dropdowns = document.querySelectorAll('.user-profile');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
};

// تبديل عرض الإشعارات
document.getElementById('notificationBell').addEventListener('click', function(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// إغلاق دروبداون الإشعارات عند النقر خارجها
document.addEventListener('click', function(e) {
    if (!e.target.closest('.notification-container')) {
        document.getElementById('notificationDropdown').style.display = 'none';
    }
});

// تحديد الإشعارات كمقروءة
document.querySelector('.mark-read').addEventListener('click', function() {
    document.querySelectorAll('.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').textContent = '0';
});

// تحميل صورة جديدة
function uploadNewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            document.getElementById("profileImage").src = imageData;
            localStorage.setItem("profileImage", imageData);
        };
        reader.readAsDataURL(file);
    }
}

// حذف صورة الملف الشخصي
function deleteProfileImage() {
    const defaultImage = "./images/pngtree-vector-users-icon-png-image_856952.jpg";
    document.getElementById("profileImage").src = defaultImage;
    localStorage.removeItem("profileImage");
}

// تحميل البيانات عند تشغيل الصفحة
document.addEventListener("DOMContentLoaded", function () {
    const profileImage = localStorage.getItem("profileImage");
    if (profileImage) {
        document.getElementById("profileImage").src = profileImage;
    }

    const imgElement = document.querySelector(".user-profile img");
    if (imgElement) {
        imgElement.src = profileImage || "./images/pngtree-vector-users-icon-png-image_856952.jpg";
    }

    const username = localStorage.getItem("username");
    if (username) {
        document.querySelector(".user-profile span").textContent = "Hi, " + username;
        document.querySelector(".user-info h3").textContent = username;
    }

    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
        updateProfileDisplay(userProfile);
        document.getElementById('firstname').value = userProfile.fullName.split(' ')[0] || '';
        document.getElementById('lastname').value = userProfile.fullName.split(' ')[1] || '';
        document.getElementById('useremail').value = userProfile.email;
        document.getElementById('userbio').value = userProfile.bio;
    }

    const settingsForm = document.querySelector('#settings form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const updatedUserData = {
                fullName: document.getElementById("firstname").value + ' ' + document.getElementById("lastname").value,
                email: document.getElementById("useremail").value,
                bio: document.getElementById("userbio").value,
                mobile: "(123) 123 1234",
                location: "USA"
            };
            localStorage.setItem('userProfile', JSON.stringify(updatedUserData));
            updateProfileDisplay(updatedUserData);
            alert("تم حفظ التغييرات بنجاح!");
        });
    }

    if (userProfile) {
        populateSettingsForm(userProfile);
    }
});

function updateProfileDisplay(data) {
    document.querySelector('.card-body h4').textContent = data.fullName;
    document.querySelector('.card-body p.text-muted').textContent = data.bio;
    document.querySelector('.text-start p:nth-child(1) span').textContent = data.fullName;
    document.querySelector('.text-start p:nth-child(2) span').textContent = data.mobile;
    document.querySelector('.text-start p:nth-child(3) span').textContent = data.email;
    document.querySelector('.text-start p:nth-child(4) span').textContent = data.location;
}

function populateSettingsForm(data) {
    document.getElementById("firstname").value = data.fullName.split(' ')[0] || '';
    document.getElementById("useremail").value = data.email || '';
}
