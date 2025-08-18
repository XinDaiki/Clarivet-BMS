 document.addEventListener('DOMContentLoaded', function() {
        // Sidebar active/hover effect
        function updateSidebarActive(tabId) {
            const sidebarButtons = document.querySelectorAll('.sidebar-btn');
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('active');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[1].classList.add('active');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('active');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[3].classList.add('active');
            }
        }
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) { window.location.href = 'login.html'; return; }
        const user = JSON.parse(currentUser);
        document.getElementById('sidebarUserName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('sidebarUserRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('topBarUserName').textContent = `${user.firstName} ${user.lastName}`;

        // Sidebar tab switching with active highlight
        window.showTab = function(tabId) {
            ['dashboardMain','complaintsSection','officialsSection','documentsSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            updateSidebarActive(tabId);
            if (tabId === 'officialsSection') {
                loadOfficials();
            } else if (tabId === 'complaintsSection') {
                loadMyComplaints();
            } else if (tabId === 'documentsSection') {
                loadMyDocuments();
            }
        };
        // Default tab
        showTab('dashboardMain');

        // Load Officials
        function loadOfficials() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Name</th><th class="border px-4 py-2">Role</th><th class="border px-4 py-2">Username</th><th class="border px-4 py-2">Email</th><th class="border px-4 py-2">Address</th><th class="border px-4 py-2">Contact</th><th class="border px-4 py-2">Birthday</th><th class="border px-4 py-2">Gender</th></tr></thead><tbody>';
            officials.forEach(o => {
                html += `<tr>
                    <td class='border px-4 py-2'>${o.firstName} ${o.lastName}</td>
                    <td class='border px-4 py-2'>${o.role}</td>
                    <td class='border px-4 py-2'>${o.username}</td>
                    <td class='border px-4 py-2'>${o.email}</td>
                    <td class='border px-4 py-2'>${o.address || ''}</td>
                    <td class='border px-4 py-2'>${o.contact || ''}</td>
                    <td class='border px-4 py-2'>${o.birthday || ''}</td>
                    <td class='border px-4 py-2'>${o.gender || ''}</td>
                </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('officialsTableBody').innerHTML = html;
        }

        // Complaint Form
        document.getElementById('complaintForm').onsubmit = function(e) {
            e.preventDefault();
            const type = document.getElementById('complaintType').value.trim();
            const subject = document.getElementById('complaintSubject').value.trim();
            const description = document.getElementById('complaintDescription').value.trim();
            const errorDiv = document.getElementById('complaintError');
            errorDiv.textContent = '';
            if (!type || !subject || !description) {
                errorDiv.textContent = 'Please fill in all fields.';
                return;
            }
            const result = window.barangayApi.createComplaint({
                userId: user.id,
                type,
                subject,
                description
            });
            if (result.success) {
                document.getElementById('complaintForm').reset();
                loadMyComplaints();
            } else {
                errorDiv.textContent = result.message || 'Failed to submit complaint.';
            }
        };
        // Load My Complaints
        function loadMyComplaints() {
            const complaints = window.barangayApi.getComplaints(user.id);
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Type</th><th class="border px-4 py-2">Subject</th><th class="border px-4 py-2">Description</th><th class="border px-4 py-2">Status</th></tr></thead><tbody>';
            complaints.forEach(c => {
                html += `<tr><td class='border px-4 py-2'>${c.type}</td><td class='border px-4 py-2'>${c.subject}</td><td class='border px-4 py-2'>${c.description}</td><td class='border px-4 py-2'>${c.status}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('myComplaints').innerHTML = html;
        }

        // Document Form
        document.getElementById('documentForm').onsubmit = function(e) {
            e.preventDefault();
            const type = document.getElementById('documentType').value.trim();
            const purpose = document.getElementById('documentPurpose').value.trim();
            const errorDiv = document.getElementById('documentError');
            errorDiv.textContent = '';
            if (!type || !purpose) {
                errorDiv.textContent = 'Please fill in all fields.';
                return;
            }
            const result = window.barangayApi.createDocument({
                userId: user.id,
                type,
                purpose
            });
            if (result.success) {
                document.getElementById('documentForm').reset();
                loadMyDocuments();
            } else {
                errorDiv.textContent = result.message || 'Failed to request document.';
            }
        };
        // Load My Documents
        function loadMyDocuments() {
            const documents = window.barangayApi.getDocuments(user.id);
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Type</th><th class="border px-4 py-2">Purpose</th><th class="border px-4 py-2">Status</th></tr></thead><tbody>';
            documents.forEach(doc => {
                html += `<tr><td class='border px-4 py-2'>${doc.type}</td><td class='border px-4 py-2'>${doc.purpose}</td><td class='border px-4 py-2'>${doc.status}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('myDocuments').innerHTML = html;
        }
    });

    // Officials can upload their own profile picture
        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser') || '{}');
        }
        function getOfficialsPics() {
            return JSON.parse(localStorage.getItem('barangayOfficialsPics') || '{}');
        }
        function saveOfficialsPics(obj) {
            localStorage.setItem('barangayOfficialsPics', JSON.stringify(obj));
        }
        function canUploadOfficialPic() {
            const user = getCurrentUser();
            return ['kagawad','chairman','official','admin'].includes((user.role || '').toLowerCase());
        }
        if (canUploadOfficialPic()) {
            document.getElementById('officialPicUploadContainer').classList.remove('hidden');
        }
        const officialPicForm = document.getElementById('officialPicForm');
        if (officialPicForm) {
            officialPicForm.onsubmit = function(e) {
                e.preventDefault();
                const input = document.getElementById('officialPicInput');
                const errorDiv = document.getElementById('officialPicError');
                errorDiv.textContent = '';
                if (!input.files || !input.files[0]) {
                    errorDiv.textContent = 'Please select an image.';
                    return;
                }
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const user = getCurrentUser();
                    const pics = getOfficialsPics();
                    pics[user.username] = evt.target.result;
                    saveOfficialsPics(pics);
                    renderOfficialsContacts();
                    officialPicForm.reset();
                };
                reader.readAsDataURL(file);
            };
        }
        function updateTime(id) {
            const el = document.getElementById(id);
            if (el) {
                const now = new Date();
                const timeString = now.toLocaleString();
                el.textContent = 'Last updated: ' + timeString;
            }
        }
    document.addEventListener('DOMContentLoaded', function() {
        // Officials Contacts Card
        function renderOfficialsContacts() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
            const container = document.getElementById('officialsContactsCard');
            if (!container) return;
            container.innerHTML = '';
            const pics = getOfficialsPics();
            officials.forEach(o => {
                const div = document.createElement('div');
                div.className = 'flex items-center mb-3 p-2 bg-gray-50 rounded shadow-sm';
                const imgSrc = pics[o.username] || 'brgy.png';
                div.innerHTML = `<img src='${imgSrc}' alt='${o.firstName}' class='h-10 w-10 rounded-full border mr-3'>
                    <div>
                        <div class='font-semibold text-blue-800'>${o.firstName} ${o.lastName}</div>
                        <div class='text-xs text-gray-500'>${o.role}</div>
                        <div class='text-xs text-gray-700'>Contact: ${o.email || 'N/A'}</div>
                    </div>`;
                container.appendChild(div);
            });
            updateTime('officialsContactsTime');
        }

        // Officials Schedule Card
        function renderOfficialsSchedule() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
            const container = document.getElementById('officialsScheduleCard');
            if (!container) return;
            container.innerHTML = '';
            officials.forEach(o => {
                const div = document.createElement('div');
                div.className = 'flex items-center mb-3 p-2 bg-gray-50 rounded shadow-sm';
                div.innerHTML = `<img src='brgy.png' alt='${o.firstName}' class='h-8 w-8 rounded-full border mr-3'>
                    <div>
                        <div class='font-semibold text-blue-800'>${o.firstName} ${o.lastName}</div>
                        <div class='text-xs text-gray-500'>${o.role}</div>
                        <div class='text-xs text-gray-700'>Schedule: Mon-Fri 8am-5pm</div>
                    </div>`;
                container.appendChild(div);
            });
            updateTime('officialsScheduleTime');
        }

        // Announcements Card
        function getAnnouncements() {
            const db = JSON.parse(localStorage.getItem('barangayDb')) || { announcements: [] };
            return db.announcements || [];
        }
        function renderAnnouncementsCard() {
            const container = document.getElementById('announcementsCard');
            if (!container) return;
            container.innerHTML = '';
            const announcements = getAnnouncements();
            announcements.forEach(a => {
                const div = document.createElement('div');
                div.className = 'bg-white border-l-4 border-blue-800 p-3 mb-3 rounded shadow';
                div.innerHTML = `<div class='font-bold text-blue-800 text-lg mb-1'>${a.title}</div>
                    <div class='text-xs text-gray-500 mb-1'>${a.date}</div>
                    <div class='text-gray-700 text-sm mb-2'>${a.details}</div>`;
                if (a.image) {
                    div.innerHTML += `<img src='${a.image}' alt='Announcement Image' class='w-full max-h-48 object-cover rounded mb-2'>`;
                }
                container.appendChild(div);
            });
            updateTime('announcementsTime');
        }
        // Announcement form logic (with image)
        function canEditAnnouncements() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            return ['admin','chairman','kagawad','official'].includes((currentUser.role || '').toLowerCase());
        }
        if (canEditAnnouncements()) {
            document.getElementById('announcementFormContainer').classList.remove('hidden');
        }
        const announcementForm = document.getElementById('announcementForm');
        if (announcementForm) {
            announcementForm.onsubmit = function(e) {
                e.preventDefault();
                const title = document.getElementById('announcementTitle').value.trim();
                const date = document.getElementById('announcementDate').value;
                const details = document.getElementById('announcementDetails').value.trim();
                const imageInput = document.getElementById('announcementImage');
                const errorDiv = document.getElementById('announcementError');
                errorDiv.textContent = '';
                if (!title || !date || !details) {
                    errorDiv.textContent = 'Please fill in all fields.';
                    return;
                }
                let imageData = '';
                if (imageInput && imageInput.files && imageInput.files[0]) {
                    const file = imageInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        imageData = evt.target.result;
                        addAnnouncement(title, date, details, imageData);
                    };
                    reader.readAsDataURL(file);
                } else {
                    addAnnouncement(title, date, details, '');
                }
            };
        }
        function addAnnouncement(title, date, details, image) {
            const db = JSON.parse(localStorage.getItem('barangayDb')) || { announcements: [] };
            db.announcements = db.announcements || [];
            db.announcements.push({ title, date, details, image });
            localStorage.setItem('barangayDb', JSON.stringify(db));
            document.getElementById('announcementForm').reset();
            renderAnnouncementsCard();
        }

        // Only initialize announcements if barangayDb is missing or empty
        let db = JSON.parse(localStorage.getItem('barangayDb'));
        if (!db || Object.keys(db).length === 0) {
            db = {
                users: [],
                documents: [],
                complaints: [],
                announcements: [
                    { title: 'Barangay Clean-Up Drive', date: '2025-08-20', details: 'Join us for a community clean-up at 8am.' },
                    { title: 'Health Check-Up', date: '2025-08-25', details: 'Free health check-up for all residents at the barangay hall.' }
                ]
            };
            localStorage.setItem('barangayDb', JSON.stringify(db));
        }

        renderOfficialsContacts();
        renderOfficialsSchedule();
        renderAnnouncementsCard();
    });

    // Emergency Hotlines logic (resident view-only)
    function getHotlines() {
        return JSON.parse(localStorage.getItem('barangayHotlines') || '[]');
    }
    function renderHotlinesCards() {
        const container = document.getElementById('hotlinesCardList');
        if (!container) return;
        container.innerHTML = '';
        const hotlines = getHotlines();
        if (hotlines.length === 0) {
            container.innerHTML = '<div class="text-gray-500">No emergency hotlines available.</div>';
            return;
        }
        hotlines.forEach((h) => {
            const div = document.createElement('div');
            div.className = 'bg-white border-l-4 border-red-700 p-3 mb-3 rounded shadow flex items-center';
            let imgHtml = '';
            if (h.image) {
                imgHtml = `<img src='${h.image}' alt='Hotline Image' class='w-24 h-16 object-cover rounded mb-2 mr-4'>`;
            }
            div.innerHTML = `<div class='flex items-center'>${imgHtml}<div><div class='font-bold text-red-700 text-lg mb-1'>${h.name}</div>
                <div class='text-gray-700 text-sm mb-2'>${h.number}</div></div></div>`;
            container.appendChild(div);
        });
    }
    document.addEventListener('DOMContentLoaded', function() {
        renderHotlinesCards();
    });
