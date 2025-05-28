// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // API URL
    const API_URL = 'https://jobizaa.com/api/admin/sub-admin';
    
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
    const authToken = localStorage.getItem('access_token');
    
    // Function to fetch super admins from API
    function fetchSuperAdmins() {
        // Implement API call to fetch super admins
        // For now, load from localStorage
        loadSuperAdmins();
    }
    
    // Function to add a super admin via API
    function addSuperAdmin(admin) {
        return new Promise((resolve, reject) => {
            // In real implementation, this would be a fetch call to your API
            // For now, just save to localStorage
            try {
                // Add an ID to the admin
                admin.id = Date.now().toString();
                saveSuperAdmin(admin);
                resolve(admin);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Load existing super admins from API or localStorage
    fetchSuperAdmins();
    
    // Form submission event listener
    if (superAdminForm) {
        superAdminForm.addEventListener('submit', function(e) {
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
            
            // Save admin to API server
            addSuperAdmin(admin)
                .then(() => {
                    // Clear form
                    superAdminForm.reset();
                    
                    // Show success message
                    showSuccessMessage('Super admin added successfully!');
                    
                    // Refresh the list of admins
                    fetchSuperAdmins();
                })
                .catch(error => {
                    showErrorMessage('Error adding admin: ' + error.message);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
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
    
    // Function to validate phone number (basic validation)
    function validatePhone(phone) {
        const re = /^\d{10,15}$/;
        return re.test(phone.replace(/[-()\s]/g, '')); // Remove common separators
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
        // Check if superAdminForm exists
        if (!superAdminForm) return;
        
        // Create a success message element
        const successMsg = document.createElement('div');
        successMsg.textContent = message;
        successMsg.style.cssText = `
            background-color: #28a745;
            color: white;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            text-align: center;
        `;
        
        // Insert the message after the form
        superAdminForm.parentNode.insertBefore(successMsg, superAdminForm.nextSibling);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
    
    // Function to show error message
    function showErrorMessage(message) {
        // Check if superAdminForm exists
        if (!superAdminForm) return;
        
        // Create an error message element
        const errorMsg = document.createElement('div');
        errorMsg.textContent = message;
        errorMsg.style.cssText = `
            background-color: #dc3545;
            color: white;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            text-align: center;
        `;
        
        // Insert the message after the form
        superAdminForm.parentNode.insertBefore(errorMsg, superAdminForm.nextSibling);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 3000);
    }
    
    // Function to save super admin
    function saveSuperAdmin(admin) {
        // Get existing admins
        let admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        
        // Add new admin
        admins.push(admin);
        
        // Save to localStorage
        localStorage.setItem('superAdmins', JSON.stringify(admins));
        
        // Refresh the dropdown
        loadSuperAdmins();
    }
    
    // Function to delete an admin
    function deleteAdmin(adminId) {
        // Get existing admins
        let admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        
        // Remove the admin with the matching ID
        admins = admins.filter(admin => admin.id !== adminId);
        
        // Save to localStorage
        localStorage.setItem('superAdmins', JSON.stringify(admins));
        
        // Refresh the dropdown
        loadSuperAdmins();
    }
    
    // Function to load super admins into dropdown
    function loadSuperAdmins() {
        // Check if dropdown exists
        if (!superAdminNamesDropdown) return;
        
        // Get admins from localStorage
        const admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
        
        // Clear dropdown except the first option
        while (superAdminNamesDropdown.options.length > 1) {
            superAdminNamesDropdown.remove(1);
        }
        
        // Add admins to dropdown
        admins.forEach(admin => {
            const option = document.createElement('option');
            option.value = admin.id;
            option.textContent = admin.name;
            superAdminNamesDropdown.appendChild(option);
        });
        
        // Update UI to show admin count
        updateAdminCount(admins.length);
    }
    
    // Function to update admin count display
    function updateAdminCount(count) {
        if (!superAdminNamesDropdown) return;
        
        const adminCountElement = document.getElementById('adminCount');
        if (!adminCountElement) {
            const countContainer = document.createElement('div');
            countContainer.id = 'adminCount';
            countContainer.style.cssText = `
                margin-top: 10px;
                font-size: 14px;
                color: #6c757d;
            `;
            countContainer.textContent = `Total moderators: ${count}`;
            
            // Insert after the dropdown
            superAdminNamesDropdown.parentNode.insertBefore(countContainer, superAdminNamesDropdown.nextSibling);
        } else {
            adminCountElement.textContent = `Total moderators: ${count}`;
        }
    }
    
    // Function to clear all super admins
    function clearAllSuperAdmins() {
        localStorage.removeItem('superAdmins');
        loadSuperAdmins(); // Refresh dropdown
    }
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    if (tabs) {
        // Function to show tab content
        window.showTab = function(tabId) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show the selected tab content
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.remove('hidden');
            }
            
            // Set active tab
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab').forEach(tab => {
                if (tab.textContent.toLowerCase().includes(tabId.toLowerCase())) {
                    tab.classList.add('active');
                }
            });
        };
    }
    
    // Notification bell functionality
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationBell && notificationDropdown) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle dropdown visibility
            notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (notificationDropdown.style.display === 'block' && !notificationDropdown.contains(e.target) && e.target !== notificationBell) {
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
});