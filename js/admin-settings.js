// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // API URLs
    const ADD_SUPER_ADMIN_URL = 'https://jobizaa.com/api/admin/AddSuperAdmin/6516561';
    const GET_SUPER_ADMINS_URL = 'https://jobizaa.com/api/admin/sub-admin'; // Adjust if needed
    
    // Get DOM elements
    const superAdminForm = document.getElementById('superAdminForm');
    const superAdminNamesDropdown = document.getElementById('superAdminNames');
    const clearAdminsBtn = document.getElementById('clearAdminsBtn');
    const deleteSelectedAdminBtn = document.getElementById('deleteSelectedAdminBtn');
    
    // Form input elements
    const nameInput = document.getElementById('adminName');
    const emailInput = document.getElementById('adminEmail');
    const phoneInput = document.getElementById('adminPhone');
    const passwordInput = document.getElementById('adminPassword');
    const passwordConfirmInput = document.getElementById('adminPasswordConfirm');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    
    // Get auth token from localStorage
    function getAuthToken() {
        return localStorage.getItem('access_token') || localStorage.getItem('token');
    }
    
    // Function to make authenticated API requests
    async function makeAuthenticatedRequest(url, options = {}) {
        const token = getAuthToken();
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const requestOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, requestOptions);
            
            // Check if the response is OK
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                }
                
                throw new Error(errorMessage);
            }
            
            // Try to parse JSON response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return { success: true, message: 'Operation completed successfully' };
            
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
    
    // Function to fetch super admins from API
    async function fetchSuperAdmins() {
        try {
            const response = await makeAuthenticatedRequest(GET_SUPER_ADMINS_URL, {
                method: 'GET'
            });
            
            // Handle the response data
            let admins = [];
            if (response && Array.isArray(response.data)) {
                admins = response.data;
            } else if (Array.isArray(response)) {
                admins = response;
            }
            
            // Save to localStorage for offline access
            localStorage.setItem('superAdmins', JSON.stringify(admins));
            
            // Load into dropdown
            loadSuperAdminsToDropdown(admins);
            
        } catch (error) {
            console.error('Error fetching super admins:', error);
            // Fallback to localStorage if API fails
            loadSuperAdmins();
            showErrorMessage('Unable to fetch latest data from server. Showing cached data.');
        }
    }
    
    // Function to add a super admin via API
    async function addSuperAdmin(admin) {
        const payload = {
            email: admin.email,
            password: admin.password,
            password_confirmation: admin.password_confirmation,
            fullName: admin.name,
            phone: admin.phone,
            role: 'super-admin'
        };
        
        console.log('Sending payload:', payload); // For debugging
        
        try {
            const response = await makeAuthenticatedRequest(ADD_SUPER_ADMIN_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            console.log('API Response:', response); // For debugging
            
            // Save to localStorage for local UI updates
            const newAdmin = {
                id: response.id || response.data?.id || Date.now().toString(),
                email: admin.email,
                name: admin.name,
                phone: admin.phone,
                role: 'super-admin',
                created_at: new Date().toISOString()
            };
            
            saveSuperAdminLocally(newAdmin);
            
            return response;
            
        } catch (error) {
            console.error('Error adding super admin:', error);
            throw error;
        }
    }
    
    // Load existing super admins on page load
    fetchSuperAdmins();
    
    // Form submission event listener
    if (superAdminForm) {
        superAdminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset all error states
            resetErrors();
            
            // Get form values
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const passwordConfirm = passwordConfirmInput.value;
            
            // Validate form
            let isValid = true;
            
            // Validate name
            if (name.length < 3) {
                showError(nameInput, nameError, 'Name must be at least 3 characters');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Check if email already exists
            const existingAdmins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
            if (existingAdmins.some(admin => admin.email === email)) {
                showError(emailInput, emailError, 'This email is already registered');
                isValid = false;
            }
            
            // Validate phone
            if (!validatePhone(phone)) {
                showError(phoneInput, phoneError, 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate password
            if (password.length < 6) {
                showError(passwordInput, passwordError, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // Validate password confirmation
            if (password !== passwordConfirm) {
                showError(passwordConfirmInput, confirmError, 'Passwords do not match');
                isValid = false;
            }
            
            // If validation failed, stop here
            if (!isValid) {
                return;
            }
            
            // Create admin object
            const admin = {
                name: name,
                email: email,
                phone: phone,
                password: password,
                password_confirmation: passwordConfirm
            };
            
            // Show loading indicator
            const submitBtn = superAdminForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;
            
            try {
                // Add admin via API
                const response = await addSuperAdmin(admin);
                
                // Clear form
                superAdminForm.reset();
                
                // Show success message
                showSuccessMessage('Super admin added successfully!');
                
                // Refresh the list of admins
                await fetchSuperAdmins();
                
            } catch (error) {
                showErrorMessage('Error adding admin: ' + error.message);
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Clear all admins button event listener
    if (clearAdminsBtn) {
        clearAdminsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all moderators?')) {
                clearAllSuperAdmins();
                showSuccessMessage('All moderators have been deleted');
            }
        });
    }
    
    // Delete selected admin button event listener
    if (deleteSelectedAdminBtn) {
        deleteSelectedAdminBtn.addEventListener('click', function() {
            const selectedAdminId = superAdminNamesDropdown.value;
            if (selectedAdminId && selectedAdminId !== '') {
                if (confirm('Are you sure you want to delete this moderator?')) {
                    deleteAdmin(selectedAdminId);
                    showSuccessMessage('Moderator deleted successfully');
                }
            } else {
                alert('Please select a moderator to delete');
            }
        });
    }
    
    // Function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Function to validate phone number
    function validatePhone(phone) {
        const re = /^\+?[\d\s\-\(\)]{10,15}$/;
        return re.test(phone);
    }
    
    // Function to show error message
    function showError(inputElement, errorElement, message) {
        if (inputElement && errorElement) {
            inputElement.classList.add('invalid');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Function to reset all error states
    function resetErrors() {
        const inputs = [nameInput, emailInput, phoneInput, passwordInput, passwordConfirmInput];
        const errors = [nameError, emailError, phoneError, passwordError, confirmError];
        
        inputs.forEach(input => {
            if (input) input.classList.remove('invalid');
        });
        
        errors.forEach(error => {
            if (error) error.style.display = 'none';
        });
    }
    
    // Function to show success message
    function showSuccessMessage(message) {
        if (!superAdminForm) return;
        
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        successMsg.style.cssText = `
            background-color: #28a745;
            color: white;
            padding: 12px;
            border-radius: 4px;
            margin: 15px 0;
            text-align: center;
            font-weight: 500;
        `;
        
        superAdminForm.parentNode.insertBefore(successMsg, superAdminForm.nextSibling);
        
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
    
    // Function to show error message
    function showErrorMessage(message) {
        if (!superAdminForm) return;
        
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        errorMsg.style.cssText = `
            background-color: #dc3545;
            color: white;
            padding: 12px;
            border-radius: 4px;
            margin: 15px 0;
            text-align: center;
            font-weight: 500;
        `;
        
        superAdminForm.parentNode.insertBefore(errorMsg, superAdminForm.nextSibling);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
    }
    
    // Function to save super admin locally
    function saveSuperAdminLocally(admin) {
        let admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        admins.push(admin);
        localStorage.setItem('superAdmins', JSON.stringify(admins));
        loadSuperAdminsToDropdown(admins);
    }
    
    // Function to delete an admin
    function deleteAdmin(adminId) {
        let admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        admins = admins.filter(admin => admin.id !== adminId);
        localStorage.setItem('superAdmins', JSON.stringify(admins));
        loadSuperAdminsToDropdown(admins);
    }
    
    // Function to load super admins into dropdown
    function loadSuperAdminsToDropdown(admins) {
        if (!superAdminNamesDropdown) return;
        
        // Clear dropdown except the first option
        while (superAdminNamesDropdown.options.length > 1) {
            superAdminNamesDropdown.remove(1);
        }
        
        // Add admins to dropdown
        admins.forEach(admin => {
            const option = document.createElement('option');
            option.value = admin.id;
            option.textContent = `${admin.name || admin.fullName} (${admin.email})`;
            superAdminNamesDropdown.appendChild(option);
        });
        
        updateAdminCount(admins.length);
    }
    
    // Function to load super admins from localStorage (fallback)
    function loadSuperAdmins() {
        const admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        loadSuperAdminsToDropdown(admins);
    }
    
    // Function to update admin count display
    function updateAdminCount(count) {
        if (!superAdminNamesDropdown) return;
        
        let adminCountElement = document.getElementById('adminCount');
        if (!adminCountElement) {
            adminCountElement = document.createElement('div');
            adminCountElement.id = 'adminCount';
            adminCountElement.style.cssText = `
                margin-top: 10px;
                font-size: 14px;
                color: #6c757d;
                font-weight: 500;
            `;
            superAdminNamesDropdown.parentNode.insertBefore(adminCountElement, superAdminNamesDropdown.nextSibling);
        }
        
        adminCountElement.textContent = `Total moderators: ${count}`;
    }
    
    // Function to clear all super admins
    function clearAllSuperAdmins() {
        localStorage.removeItem('superAdmins');
        loadSuperAdmins();
    }
    
    // Tab switching functionality
    window.showTab = function(tabId) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
        }
        
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.textContent.toLowerCase().includes(tabId.toLowerCase()) ||
                (tabId === 'admin' && tab.textContent.toLowerCase().includes('admin'))) {
                tab.classList.add('active');
            }
        });
    };
    
    // Notification bell functionality
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationBell && notificationDropdown) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function(e) {
            if (notificationDropdown.style.display === 'block' && 
                !notificationDropdown.contains(e.target) && 
                e.target !== notificationBell) {
                notificationDropdown.style.display = 'none';
            }
        });
    }
    
    // File upload functionality
    const fileInput = document.getElementById('logo');
    const fileName = document.getElementById('file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                fileName.textContent = fileInput.files[0].name;
            } else {
                fileName.textContent = 'No file selected';
            }
        });
    }
    
    // Debug function to check authentication
    function checkAuth() {
        const token = getAuthToken();
        if (!token) {
            console.warn('No authentication token found. Please login first.');
            showErrorMessage('Authentication required. Please login first.');
            return false;
        }
        return true;
    }
    
    // Initial auth check
    if (!checkAuth()) {
        // Optionally redirect to login page
        // window.location.href = 'login.html';
    }
});