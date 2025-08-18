(function() {
    window.logout = function() {
        window.location.href = 'index.html';
    };
})();
// This simulates a backend with database functionality using localStorage
(function() {
    // Only initialize barangayDb if missing or empty
    let db = JSON.parse(localStorage.getItem('barangayDb'));
    if (!db || Object.keys(db).length === 0) {
        db = {
            users: [
                {
                    id: 1,
                    firstName: 'Barangay',
                    lastName: 'Admin',
                    username: 'admin',
                    password: 'admin123',
                    email: 'admin@barangay.gov',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    firstName: 'Juan',
                    lastName: 'Dela Cruz',
                    username: 'chairman',
                    password: 'chairman123',
                    email: 'chairman@barangay.gov',
                    role: 'chairman',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    firstName: 'Maria',
                    lastName: 'Santos',
                    username: 'kagawad1',
                    password: 'kagawad123',
                    email: 'kagawad1@barangay.gov',
                    role: 'kagawad',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    firstName: 'Pedro',
                    lastName: 'Reyes',
                    username: 'official1',
                    password: 'official123',
                    email: 'official1@barangay.gov',
                    role: 'official',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    firstName: 'Ana',
                    lastName: 'Garcia',
                    username: 'resident1',
                    password: 'resident123',
                    email: 'resident1@barangay.gov',
                    role: 'resident',
                    createdAt: new Date().toISOString()
                }
            ],
            documents: [],
            complaints: [],
            announcements: []
        };
        localStorage.setItem('barangayDb', JSON.stringify(db));
    }

    // Get the entire database
    function getDb() {
        return JSON.parse(localStorage.getItem('barangayDb'));
    }

    // Save the entire database
    function saveDb(db) {
        localStorage.setItem('barangayDb', JSON.stringify(db));
    }

    // API simulation
    window.barangayApi = {
        // User authentication
        login: function(username, password) {
            const db = getDb();
            const user = db.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
        },

        // User registration
        register: function(userData) {
    const db = getDb();
            
            // Check if username already exists
            const usernameExists = db.users.some(u => u.username === userData.username);
            if (usernameExists) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }
            
            // Check if email already exists
            const emailExists = db.users.some(u => u.email === userData.email);
            if (emailExists) {
                return {
                    success: false,
                    message: 'Email already exists'
                };
            }
            
            // Create new user (include all info fields)
            const newUser  = {
                id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                password: userData.password, // In real app, this would be hashed
                email: userData.email,
                role: userData.role,
                address: userData.address || '',
                contact: userData.contact || '',
                birthday: userData.birthday || '',
                gender: userData.gender || '',
                createdAt: new Date().toISOString()
            };
            db.users.push(newUser );
            saveDb(db);
            return {
                success: true,
                user: {
                    id: newUser .id,
                    firstName: newUser .firstName,
                    lastName: newUser .lastName,
                    username: newUser .username,
                    email: newUser .email,
                    role: newUser .role,
                    address: newUser.address,
                    contact: newUser.contact,
                    birthday: newUser.birthday,
                    gender: newUser.gender
                }
            };
        },

        // Get all users (admin only)
        getUsers: function() {
            const db = getDb();
            return db.users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                address: user.address || '',
                contact: user.contact || '',
                birthday: user.birthday || '',
                gender: user.gender || '',
                createdAt: user.createdAt
            }));
        },

        // Add new user (admin only)
        add: function(userData) {
    return this.register(userData);
},

        // Get current user
        getCurrent:  function(userId) {
            const db = getDb();
            const user = db.users.find(u => u.id === userId);
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'User  not found'
                };
            }
        },

        // Document management
        getDocuments: function(userId = null) {
            const db = getDb();
            if (userId) {
                return db.documents.filter(doc => doc.userId === userId);
            }
            return db.documents;
        },

        createDocument: function(documentData) {
            const db = getDb();
            const newDoc = {
                id: db.documents.length > 0 ? Math.max(...db.documents.map(d => d.id)) + 1 : 1,
                userId: documentData.userId,
                type: documentData.type,
                purpose: documentData.purpose,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            db.documents.push(newDoc);
            saveDb(db);
            
            return {
                success: true,
                document: newDoc
            };
        },

        // Complaint management
        getComplaints: function(userId = null) {
            const db = getDb();
            if (userId) {
                return db.complaints.filter(c => c.userId === userId);
            }
            return db.complaints;
        },

        createComplaint: function(complaintData) {
            const db = getDb();
            const newComplaint = {
                id: db.complaints.length > 0 ? Math.max(...db.complaints.map(c => c.id)) + 1 : 1,
                userId: complaintData.userId,
                type: complaintData.type,
                subject: complaintData.subject,
                description: complaintData.description,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            db.complaints.push(newComplaint);
            saveDb(db);
            
            return {
                success: true,
                complaint: newComplaint
            };
        }
    };
})();

// Tab switching logic for login/register and login redirect
document.addEventListener("DOMContentLoaded", function() {
    // Debug: Show current users in localStorage
    if (window.barangayApi && window.barangayApi.getUsers) {
        console.log('Current users:', window.barangayApi.getUsers());
    }
    // Check if barangayApi is loaded
    if (!window.barangayApi) {
        alert('Account system not loaded. Please check that script.js is included and the path is correct.');
        console.error('barangayApi not found. Make sure script.js is loaded before this script.');
        return;
    }
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginFormContainer = document.getElementById("loginFormContainer");
    const registerFormContainer = document.getElementById("registerFormContainer");

    // Error message containers
    let loginError = document.createElement('div');
    loginError.id = 'loginErrorMsg';
    loginError.className = 'text-red-600 text-sm mb-2 text-center';
    loginFormContainer.insertBefore(loginError, loginFormContainer.querySelector('form'));

    let registerError = document.createElement('div');
    registerError.id = 'registerErrorMsg';
    registerError.className = 'text-red-600 text-sm mb-2 text-center';
    registerFormContainer.insertBefore(registerError, registerFormContainer.querySelector('form'));

    if (loginTab && registerTab && loginFormContainer && registerFormContainer) {
        loginTab.onclick = function() {
            loginFormContainer.classList.remove("hidden");
            registerFormContainer.classList.add("hidden");
            loginTab.style.background = "#2563eb";
            loginTab.style.color = "#fff";
            registerTab.style.background = "#fff";
            registerTab.style.color = "#2563eb";
        };
        registerTab.onclick = function() {
            loginFormContainer.classList.add("hidden");
            registerFormContainer.classList.remove("hidden");
            registerTab.style.background = "#2563eb";
            registerTab.style.color = "#fff";
            loginTab.style.background = "#fff";
            loginTab.style.color = "#2563eb";
        };
    }

    // Password eye toggle for all forms
    document.querySelectorAll('.relative button[type="button"]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });

    // Login form logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginError.textContent = '';
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            const result = window.barangayApi.login(username, password);
            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                window.location.href = 'dashboard2.html';
            } else {
                loginError.textContent = result.message || 'Login failed.';
                // Switch to register tab if login fails
                registerTab.click();
            }
        });
    }

    // Register form logic
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerError.textContent = '';
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('userRole').value;
            const idNumberInput = document.getElementById('idNumber');
            const idNumber = idNumberInput ? idNumberInput.value.trim() : '';

            if (password !== confirmPassword) {
                registerError.textContent = 'Passwords do not match.';
                return;
            }
            if (!firstName || !lastName || !username || !email || !password || !role) {
                registerError.textContent = 'Please fill in all fields.';
                return;
            }
            if (role === 'chairman' && idNumber !== '223012422') {
                registerError.textContent = 'Please put Chairman ID.';
                return;
            }
            if (role === 'official' && idNumber !== '00212293') {
                registerError.textContent = 'Please put Official ID.';
                return;
            }

            const result = window.barangayApi.register({
                firstName,
                lastName,
                username,
                password,
                email,
                role,
                idNumber
            });
            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                window.location.href = 'dashboard2.html';
            } else {
                registerError.textContent = result.message || 'Registration failed.';
            }
        });
    }
});

 function logout() {
       window.location.href = 'index.html';
   }

   // Password eye toggle for all forms
   function togglePasswordVisibility(inputId) {
       const input = document.getElementById(inputId);
       if (input.type === "password") {
           input.type = "text";
       } else {
           input.type = "password";
       }
   }

   // Restrict dashboard access by role
   function openDashboard(type) {
       const currentUser = localStorage.getItem('currentUser');
       if (!currentUser) {
           alert('Please login first.');
           window.location.href = 'login.html';
           return;
       }
       const user = JSON.parse(currentUser);
       // Accept both lowercase and uppercase role names
       const allowedRoles = ['chairman', 'kagawad', 'admin'];
       const userRole = user.role ? user.role.toLowerCase() : '';
       if (type === 'official') {
           if (allowedRoles.includes(userRole)) {
               window.location.href = 'dashboard-official.html';
           } else {
               alert('CLASSIFIED: You are not allowed to access Official Dashboard.');
           }
       } else if (type === 'admin') {
           if (allowedRoles.includes(userRole)) {
               window.location.href = 'dashboard-admin.html';
           } else {
               alert('CLASSIFIED: You are not allowed to access Admin Tools.');
           }
       }
   }

   // Tab switching logic for login/register
   document.addEventListener("DOMContentLoaded", function() {
       const loginTab = document.getElementById("loginTab");
       const registerTab = document.getElementById("registerTab");
       const loginFormContainer = document.getElementById("loginFormContainer");
       const registerFormContainer = document.getElementById("registerFormContainer");

       if (loginTab && registerTab && loginFormContainer && registerFormContainer) {
           loginTab.onclick = function() {
               loginFormContainer.classList.remove("hidden");
               registerFormContainer.classList.add("hidden");
               loginTab.style.background = "#2563eb";
               loginTab.style.color = "#fff";
               registerTab.style.background = "#fff";
               registerTab.style.color = "#2563eb";
           };
           registerTab.onclick = function() {
               loginFormContainer.classList.add("hidden");
               registerFormContainer.classList.remove("hidden");
               registerTab.style.background = "#2563eb";
               registerTab.style.color = "#fff";
               loginTab.style.background = "#fff";
               loginTab.style.color = "#2563eb";
           };
       }
   });
