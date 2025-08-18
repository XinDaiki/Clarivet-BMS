 document.addEventListener('DOMContentLoaded', function() {
    // Dashboard population update logic
    function updatePopulationCards() {
        const users = window.barangayApi.getUsers();
        const residents = users.filter(u => ['resident','kagawad','chairman','official'].includes(u.role));
        const total = residents.length;
        const male = residents.filter(u => (u.gender || '').toLowerCase() === 'male').length;
        const female = residents.filter(u => (u.gender || '').toLowerCase() === 'female').length;
        const popEl = document.querySelector('.dashboard-population');
        const maleEl = document.querySelector('.dashboard-male');
        const femaleEl = document.querySelector('.dashboard-female');
        if (popEl) popEl.querySelector('.dashboard-count').textContent = total;
        if (maleEl) maleEl.querySelector('.dashboard-count').textContent = male;
        if (femaleEl) femaleEl.querySelector('.dashboard-count').textContent = female;
    }
    // Initial update
    updatePopulationCards();
    // Resident search/filter logic
    let residentSearchTerm = '';
    const residentSearchInput = document.getElementById('residentSearchInput');
    if (residentSearchInput) {
        residentSearchInput.addEventListener('input', function(e) {
            residentSearchTerm = e.target.value.trim().toLowerCase();
            loadResidentInfoTable();
        });
    }
    // Only initialize barangayDb if missing or empty
    function initializeBarangayDb() {
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
    }
    initializeBarangayDb();
        // Sidebar active/hover effect
        function updateSidebarActive(tabId) {
            const sidebarButtons = document.querySelectorAll('.sidebar-btn');
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('active');
            } else if (tabId === 'residentInfoSection') {
                sidebarButtons[1].classList.add('active');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('active');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[3].classList.add('active');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[4].classList.add('active');
            }else if (tabId === 'announcementSection') {
                sidebarButtons[5].classList.add('active');
            }else if (tabId === 'hotlinesSection') {
                sidebarButtons[6].classList.add('active');
            }
        }
            // Resident Information Add Resident logic
            const addResidentInfoBtn = document.getElementById('addResidentInfoBtn');
            const addResidentInfoForm = document.getElementById('addResidentInfoForm');
            const cancelAddResidentInfo = document.getElementById('cancelAddResidentInfo');
            if (addResidentInfoBtn && addResidentInfoForm && cancelAddResidentInfo) {
                addResidentInfoBtn.onclick = function() {
                    addResidentInfoForm.classList.remove('hidden');
                };
                cancelAddResidentInfo.onclick = function() {
                    addResidentInfoForm.classList.add('hidden');
                    document.getElementById('residentInfoForm').reset();
                    document.getElementById('residentInfoAddError').textContent = '';
                };
                document.getElementById('residentInfoForm').onsubmit = function(e) {
                    e.preventDefault();
                    const firstName = document.getElementById('residentInfoFirstName').value.trim();
                    const lastName = document.getElementById('residentInfoLastName').value.trim();
                    const username = document.getElementById('residentInfoUsername').value.trim();
                    const email = document.getElementById('residentInfoEmail').value.trim();
                    const password = document.getElementById('residentInfoPassword').value;
                    const role = document.getElementById('residentInfoRole').value;
                    const address = document.getElementById('residentInfoAddress').value.trim();
                    const contact = document.getElementById('residentInfoContact').value.trim();
                    const birthday = document.getElementById('residentInfoBirthday').value;
                    const gender = document.getElementById('residentInfoGender').value;
                    const errorDiv = document.getElementById('residentInfoAddError');
                    errorDiv.textContent = '';
                    if (!firstName || !lastName || !username || !email || !password || !role || !address || !contact || !birthday) {
                        errorDiv.textContent = 'Please fill in all required fields.';
                        return;
                    }
                    // Add resident to db
                    const result = window.barangayApi.register({firstName,lastName,username,password,email,role,address,contact,birthday,gender});
                    if (result.success) {
                        addResidentInfoForm.classList.add('hidden');
                        document.getElementById('residentInfoForm').reset();
                        loadResidentInfoTable();
                    } else {
                        errorDiv.textContent = result.message || 'Failed to add resident.';
                    }
                };
            }
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) { window.location.href = 'login.html'; return; }
        const user = JSON.parse(currentUser);
        document.getElementById('sidebarUserName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('sidebarUserRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('topBarUserName').textContent = `${user.firstName} ${user.lastName}`;

        // Sidebar tab switching with active highlight
        window.showTab = function(tabId) {
            ['dashboardMain','residentsSection','officialsSection','complaintsSection','documentsSection','announcementSection','hotlinesSection', 'residentInfoSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            const sidebarButtons = document.querySelectorAll('aside nav ul li button');
            sidebarButtons.forEach(btn => btn.classList.remove('bg-red-500','text-white','font-semibold'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('bg-red-500','text-white','font-semibold');
            } else if (tabId === 'residentsSection') {
                sidebarButtons[1].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[3].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[4].classList.add('bg-gray-800','text-white','font-semibold');
            }else if (tabId === 'announcementSection') {
                sidebarButtons[5].classList.add('bg-gray-800','text-white','font-semibold');
            }else if (tabId === 'hotlinesSection') {
                sidebarButtons[6].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'residentInfoSection') {
                sidebarButtons[7].classList.add('bg-gray-800','text-white','font-semibold');
            }
        };
        // Default tab
        showTab('dashboardMain');
        // Always load Resident Information table when tab is shown
        window.showTab = (function(origShowTab) {
            return function(tabId) {
                origShowTab(tabId);
                if (tabId === 'residentInfoSection') {
                    if (typeof loadResidentInfoTable === 'function') loadResidentInfoTable();
                }
            };
        })(window.showTab);
            // Resident Information Table rendering
            function loadResidentInfoTable() {
    updatePopulationCards();
                let residents = window.barangayApi.getUsers().filter(u => ['resident','kagawad','chairman','official'].includes(u.role));
                if (residentSearchTerm) {
                    residents = residents.filter(r =>
                        (r.firstName && r.firstName.toLowerCase().includes(residentSearchTerm)) ||
                        (r.lastName && r.lastName.toLowerCase().includes(residentSearchTerm)) ||
                        (r.username && r.username.toLowerCase().includes(residentSearchTerm)) ||
                        (r.email && r.email.toLowerCase().includes(residentSearchTerm)) ||
                        (r.contact && r.contact.toLowerCase().includes(residentSearchTerm))
                    );
                }
                const grid = document.getElementById('residentInfoGrid');
                if (!grid) return;
                grid.innerHTML = '';
                if (residents.length === 0) {
                    grid.innerHTML = '<div class="text-gray-500 text-center py-8 col-span-1 md:col-span-2 lg:col-span-3">No residents found.</div>';
                    return;
                }
                // Get current user role
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const canUploadPic = ['admin','chairman','kagawad','official'].includes((currentUser.role || '').toLowerCase());
                residents.forEach(r => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-lg shadow p-6 flex flex-col items-center';
                    let imgSrc = (r.profilePic && typeof r.profilePic === 'string' && r.profilePic.startsWith('data:image')) ? r.profilePic : 'brgy.png';
                    card.innerHTML = `
                        <img src="${imgSrc}" alt="Profile" class="h-20 w-20 rounded-full object-cover mb-2 border">
                        <div class="font-bold text-lg text-blue-800 mb-1">${r.firstName} ${r.lastName}</div>
                        <div class="text-xs text-gray-500 mb-1">${r.role}</div>
                        <div class="text-xs text-gray-700 mb-1">Username: ${r.username}</div>
                        <div class="text-xs text-gray-700 mb-1">Email: ${r.email}</div>
                        <div class="text-xs text-gray-700 mb-1">Address: ${r.address || ''}</div>
                        <div class="text-xs text-gray-700 mb-1">Contact: ${r.contact || ''}</div>
                        <div class="text-xs text-gray-700 mb-1">Birthday: ${r.birthday || ''}</div>
                        <div class="text-xs text-gray-700 mb-1">Gender: ${r.gender || ''}</div>
                        <div class="flex gap-2 mt-2">
                            <button onclick="editResident(${r.id})" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onclick="deleteResident(${r.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    `;
                    // Only show profile picture upload for admin/officials
                    if (canUploadPic) {
                        const uploadForm = document.createElement('form');
                        uploadForm.className = 'mt-2 w-full flex flex-col items-center';
                        uploadForm.enctype = 'multipart/form-data';
                        uploadForm.innerHTML = `
                            <input type="file" accept="image/*" class="border px-2 py-1 rounded w-full mb-2" id="profilePicInput${r.id}">
                            <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">Upload Picture</button>
                            <div class="text-red-600 text-xs mt-1" id="profilePicError${r.id}"></div>
                        `;
                        uploadForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const input = uploadForm.querySelector('input[type="file"]');
                            const errorDiv = uploadForm.querySelector(`#profilePicError${r.id}`);
                            errorDiv.textContent = '';
                            if (!input.files || !input.files[0]) {
                                errorDiv.textContent = 'Please select an image.';
                                return;
                            }
                            const file = input.files[0];
                            if (!file.type.startsWith('image/')) {
                                errorDiv.textContent = 'File must be an image.';
                                return;
                            }
                            const reader = new FileReader();
                            reader.onload = function(evt) {
                                const db = JSON.parse(localStorage.getItem('barangayDb'));
                                const idx = db.users.findIndex(u => u.id === r.id);
                                if (idx > -1) {
                                    db.users[idx].profilePic = evt.target.result;
                                    localStorage.setItem('barangayDb', JSON.stringify(db));
                                    input.value = '';
                                    // Update only the image src in this card
                                    card.querySelector('img').src = evt.target.result;
                                    errorDiv.textContent = 'Profile picture updated!';
                                }
                            };
                            reader.readAsDataURL(file);
                        });
                        card.appendChild(uploadForm);
                    }
                    grid.appendChild(card);
                });
            }
            // Profile picture upload logic
            window.uploadProfilePic = function(e, userId) {
                e.preventDefault();
                const input = document.getElementById('profilePicInput' + userId);
                if (!input.files || !input.files[0]) return;
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const db = JSON.parse(localStorage.getItem('barangayDb'));
                    const idx = db.users.findIndex(u => u.id === userId);
                    if (idx > -1) {
                        db.users[idx].profilePic = evt.target.result;
                        localStorage.setItem('barangayDb', JSON.stringify(db));
                        // Clear file input after upload
                        input.value = '';
                        loadResidentInfoTable();
                    }
                };
                reader.readAsDataURL(file);
            };
            // Edit Resident logic
            window.editResident = function(userId) {
    updatePopulationCards();
                const db = JSON.parse(localStorage.getItem('barangayDb'));
                const user = db.users.find(u => u.id === userId);
                if (!user) return;
                // Show form and fill values
                document.getElementById('addResidentInfoForm').classList.remove('hidden');
                document.getElementById('residentInfoFirstName').value = user.firstName;
                document.getElementById('residentInfoLastName').value = user.lastName;
                document.getElementById('residentInfoUsername').value = user.username;
                document.getElementById('residentInfoEmail').value = user.email;
                document.getElementById('residentInfoPassword').value = user.password;
                document.getElementById('residentInfoRole').value = user.role;
                document.getElementById('residentInfoAddress').value = user.address || '';
                document.getElementById('residentInfoContact').value = user.contact || '';
                document.getElementById('residentInfoBirthday').value = user.birthday || '';
                document.getElementById('residentInfoGender').value = user.gender || '';
                document.getElementById('residentInfoAddError').textContent = '';
                window.editingResidentId = userId;
            };
            // Update form submit for edit
            document.getElementById('residentInfoForm').onsubmit = function(e) {
                e.preventDefault();
                const firstName = document.getElementById('residentInfoFirstName').value.trim();
                const lastName = document.getElementById('residentInfoLastName').value.trim();
                const username = document.getElementById('residentInfoUsername').value.trim();
                const email = document.getElementById('residentInfoEmail').value.trim();
                const password = document.getElementById('residentInfoPassword').value;
                const role = document.getElementById('residentInfoRole').value;
                const address = document.getElementById('residentInfoAddress').value.trim();
                const contact = document.getElementById('residentInfoContact').value.trim();
                const birthday = document.getElementById('residentInfoBirthday').value;
                const gender = document.getElementById('residentInfoGender').value;
                const errorDiv = document.getElementById('residentInfoAddError');
                errorDiv.textContent = '';
                if (!firstName || !lastName || !username || !email || !password || !role) {
                    errorDiv.textContent = 'Please fill in all required fields.';
                    return;
                }
                const db = JSON.parse(localStorage.getItem('barangayDb'));
                if (window.editingResidentId) {
                    // Edit existing resident
                    const idx = db.users.findIndex(u => u.id === window.editingResidentId);
                    if (idx > -1) {
                        db.users[idx] = {
                            ...db.users[idx],
                            firstName,
                            lastName,
                            username,
                            email,
                            password,
                            role,
                            address,
                            contact,
                            birthday,
                            gender
                        };
                        localStorage.setItem('barangayDb', JSON.stringify(db));
                        window.editingResidentId = null;
                        document.getElementById('addResidentInfoForm').classList.add('hidden');
                        document.getElementById('residentInfoForm').reset();
                        loadResidentInfoTable();
                        return;
                    }
                }
                // Add new resident
                const result = window.barangayApi.register({firstName,lastName,username,password,email,role,address,contact,birthday,gender});
                if (result.success) {
                    document.getElementById('addResidentInfoForm').classList.add('hidden');
                    document.getElementById('residentInfoForm').reset();
                    loadResidentInfoTable();
                } else {
                    errorDiv.textContent = result.message || 'Failed to add resident.';
                }
            };
            // Delete Resident logic
            window.deleteResident = function(userId) {
    updatePopulationCards();
    updatePopulationCards();
                if (!confirm('Are you sure you want to delete this resident?')) return;
                const db = JSON.parse(localStorage.getItem('barangayDb'));
                db.users = db.users.filter(u => u.id !== userId);
                localStorage.setItem('barangayDb', JSON.stringify(db));
                loadResidentInfoTable();
            };
            // Initial load for Resident Information tab
            loadResidentInfoTable();

        // Load Residents
        function loadResidents() {
            const residents = window.barangayApi.getUsers().filter(u => ['resident','kagawad','chairman','official'].includes(u.role));
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Name</th><th class="border px-4 py-2 text-center">Role</th><th class="border px-4 py-2 text-center">Username</th><th class="border px-4 py-2 text-center">Email</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            residents.forEach(r => {
                    html += `<tr><td class='border px-4 py-2 text-center'>${r.firstName} ${r.lastName}</td><td class='border px-4 py-2 text-center'>${r.role}</td><td class='border px-4 py-2 text-center'>${r.username}</td><td class='border px-4 py-2 text-center'>${r.email}</td><td class='border px-4 py-2 text-center'><button onclick="deleteResident(${r.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            // === TAB SWITCHING & SIDEBAR ===
            document.getElementById('residentsTableBody').innerHTML = html;
        }

        // Load Officials
        function loadOfficials() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Name</th><th class="border px-4 py-2 text-center">Role</th><th class="border px-4 py-2 text-center">Username</th><th class="border px-4 py-2 text-center">Email</th></tr></thead><tbody>';
            officials.forEach(o => {
                    html += `<tr><td class='border px-4 py-2 text-center'>${o.firstName} ${o.lastName}</td><td class='border px-4 py-2 text-center'>${o.role}</td><td class='border px-4 py-2 text-center'>${o.username}</td><td class='border px-4 py-2 text-center'>${o.email}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('officialsTableBody').innerHTML = html;
        }

        // Load Complaints
        function loadComplaints() {
            const complaints = window.barangayApi.getComplaints();
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Resident</th><th class="border px-4 py-2 text-center">Type</th><th class="border px-4 py-2 text-center">Subject</th><th class="border px-4 py-2 text-center">Description</th><th class="border px-4 py-2 text-center">Status</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            complaints.forEach(c => {
                const resident = window.barangayApi.getUsers().find(u => u.id === c.userId);
                    html += `<tr><td class='border px-4 py-2 text-center'>${resident ? resident.firstName + ' ' + resident.lastName : 'Unknown'}</td><td class='border px-4 py-2 text-center'>${c.type}</td><td class='border px-4 py-2 text-center'>${c.subject}</td><td class='border px-4 py-2 text-center'>${c.description}</td><td class='border px-4 py-2 text-center'>${c.status}</td><td class='border px-4 py-2 text-center'><button onclick="deleteComplaint(${c.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('complaintsTableBody').innerHTML = html;
        }

        // Load Documents
        function loadDocuments() {
            const documents = window.barangayApi.getDocuments();
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Resident</th><th class="border px-4 py-2 text-center">Type</th><th class="border px-4 py-2 text-center">Purpose</th><th class="border px-4 py-2 text-center">Status</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            documents.forEach(doc => {
                const resident = window.barangayApi.getUsers().find(u => u.id === doc.userId);
                    html += `<tr><td class='border px-4 py-2 text-center'>${resident ? resident.firstName + ' ' + resident.lastName : 'Unknown'}</td><td class='border px-4 py-2 text-center'>${doc.type}</td><td class='border px-4 py-2 text-center'>${doc.purpose}</td><td class='border px-4 py-2 text-center' id="doc-status-${doc.id}">${doc.status}</td><td class='border px-4 py-2 text-center'><button onclick="updateDocumentStatus(${doc.id},'approved')" class="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button><button onclick="updateDocumentStatus(${doc.id},'denied')" class="bg-red-500 text-white px-2 py-1 rounded mr-2">Deny</button><button onclick="deleteDocument(${doc.id})" class="bg-red-700 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('documentsTableBody').innerHTML = html;
    // Delete Resident
    window.deleteResident = function(userId) {
        if (!confirm('Are you sure you want to delete this resident?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.users = db.users.filter(u => u.id !== userId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        // Reload table
        document.getElementById('residentsTableBody').innerHTML = '';
        loadResidents();
    };

    // Delete Complaint
    window.deleteComplaint = function(complaintId) {
        if (!confirm('Are you sure you want to delete this complaint?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.complaints = db.complaints.filter(c => c.id !== complaintId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        document.getElementById('complaintsTableBody').innerHTML = '';
        loadComplaints();
    };

    // Delete Document
    window.deleteDocument = function(docId) {
        if (!confirm('Are you sure you want to delete this document request?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.documents = db.documents.filter(d => d.id !== docId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        document.getElementById('documentsTableBody').innerHTML = '';
        loadDocuments();
    };
        }

        // Document status update function
        window.updateDocumentStatus = function(docId, status) {
            const db = JSON.parse(localStorage.getItem('barangayDb'));
            const doc = db.documents.find(d => d.id === docId);
            if (doc) {
                doc.status = status;
                doc.updatedAt = new Date().toISOString();
                localStorage.setItem('barangayDb', JSON.stringify(db));
                document.getElementById('doc-status-' + docId).textContent = status;
            }
        };

        // Load all tables on tab show
        window.showTab = function(tabId) {
            ['dashboardMain','residentsSection','officialsSection','complaintsSection','documentsSection', 'announcementSection', 'hotlinesSection', 'residentInfoSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            updateSidebarActive(tabId);
            if (tabId === 'residentsSection') {
                loadResidents();
            } else if (tabId === 'officialsSection') {
                loadOfficials();
            } else if (tabId === 'complaintsSection') {
                loadComplaints();
            } else if (tabId === 'documentsSection') {
                loadDocuments();
            }else if (tabId === 'announcementSection') {
                loadAnnouncements();
            }else if (tabId === 'hotlinesSection') {
                loadHotlines();
            }

        };
        // Default tab
        showTab('dashboardMain');
        // Add Resident button logic
        const addBtn = document.getElementById('addResidentBtn');
        const addForm = document.getElementById('addResidentForm');
        const cancelBtn = document.getElementById('cancelAddResident');
        if (addBtn && addForm && cancelBtn) {
            addBtn.onclick = function() {
                addForm.classList.remove('hidden');
            };
            cancelBtn.onclick = function() {
                addForm.classList.add('hidden');
                document.getElementById('residentForm').reset();
                document.getElementById('residentAddError').textContent = '';
            };
            document.getElementById('residentForm').onsubmit = function(e) {
                e.preventDefault();
                const firstName = document.getElementById('residentFirstName').value.trim();
                const lastName = document.getElementById('residentLastName').value.trim();
                const username = document.getElementById('residentUsername').value.trim();
                const email = document.getElementById('residentEmail').value.trim();
                const password = document.getElementById('residentPassword').value;
                const role = document.getElementById('residentRole').value;
                const errorDiv = document.getElementById('residentAddError');
                errorDiv.textContent = '';
                if (!firstName || !lastName || !username || !email || !password || !role) {
                    errorDiv.textContent = 'Please fill in all fields.';
                    return;
                }
                const result = window.barangayApi.register({firstName,lastName,username,password,email,role});
                if (result.success) {
                    addForm.classList.add('hidden');
                    document.getElementById('residentForm').reset();
                    loadResidents();
                } else {
                    errorDiv.textContent = result.message || 'Failed to add resident.';
                }
            };
        }
    });

    // === ANNOUNCEMENT FUNCTIONS ===
function loadAnnouncements() {
    const db = JSON.parse(localStorage.getItem('barangayDb')) || { announcements: [] };
    const list = db.announcements || [];
    let html = '';
    if (list.length === 0) {
        html = '<p class="text-gray-500">No announcements yet.</p>';
    } else {
        list.forEach(a => {
            html += `
                <div class="bg-white border-l-4 border-blue-800 p-3 mb-3 rounded shadow">
                    <div class="font-bold text-blue-800 text-lg mb-1">${a.title}</div>
                    <div class="text-xs text-gray-500 mb-1">${a.date}</div>
                    <div class="text-gray-700 text-sm mb-2">${a.details}</div>
                    ${a.image ? `<img src="${a.image}" alt="Announcement Image" class="w-full max-h-48 object-cover rounded mb-2">` : ''}
                    <button onclick="editAnnouncement(${a.id})" class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onclick="deleteAnnouncement(${a.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
            `;
        });
    }
    var _listEl = document.getElementById('announcementCardList'); if (_listEl) { _listEl.innerHTML = html; }
}

function saveAnnouncements(list) {
    const db = JSON.parse(localStorage.getItem('barangayDb')) || {};
    db.announcements = list;
    localStorage.setItem('barangayDb', JSON.stringify(db));
}

document.getElementById('announcementForm').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('announcementId').value;
    const title = document.getElementById('announcementTitle').value.trim();
    const date = document.getElementById('announcementDate').value;
    const details = document.getElementById('announcementDetails').value.trim();
    const imageFile = document.getElementById('announcementImage').files[0];

    if (!title || !date || !details) return alert('Please fill in all required fields.');

    let imageBase64 = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageBase64 = event.target.result;
            saveAnnouncementData(id, title, date, details, imageBase64);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveAnnouncementData(id, title, date, details, imageBase64);
    }
};

function saveAnnouncementData(id, title, date, details, imageBase64) {
    const db = JSON.parse(localStorage.getItem('barangayDb')) || { announcements: [] };
    const list = db.announcements || [];

    if (id) {
        // Update
        const idx = list.findIndex(a => a.id == id);
        if (idx > -1) {
            list[idx] = { ...list[idx], title, date, details, image: imageBase64 || list[idx].image };
        }
    } else {
        // Add new
        const newId = Date.now();
        list.push({ id: newId, title, date, details, image: imageBase64 });
    }
    saveAnnouncements(list);
    resetAnnouncementForm();
    loadAnnouncements();
}

function editAnnouncement(id) {
    const db = JSON.parse(localStorage.getItem('barangayDb'));
    const announcement = db.announcements.find(a => a.id === id);
    if (!announcement) return;

    document.getElementById('announcementId').value = announcement.id;
    document.getElementById('announcementTitle').value = announcement.title;
    document.getElementById('announcementDate').value = announcement.date;
    document.getElementById('announcementDetails').value = announcement.details;
    var _submitBtn = document.getElementById('announcementSubmitBtn'); if (_submitBtn) _submitBtn.textContent = 'Update Announcement';
    var _cancelBtn2 = document.getElementById('announcementCancelEdit'); if (_cancelBtn2) _cancelBtn2.classList.remove('hidden');
}

function deleteAnnouncement(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    const db = JSON.parse(localStorage.getItem('barangayDb'));
    db.announcements = db.announcements.filter(a => a.id !== id);
    saveAnnouncements(db.announcements);
    loadAnnouncements();
}

function resetAnnouncementForm() {
    document.getElementById('announcementForm').reset();
    document.getElementById('announcementId').value = '';
    document.getElementById('announcementSubmitBtn').textContent = 'Add Announcement';
    document.getElementById('announcementCancelEdit').classList.add('hidden');
}

var _cancelBtn = document.getElementById('announcementCancelEdit');
if (_cancelBtn) _cancelBtn.onclick = function() {
    resetAnnouncementForm();
};
