// Toggle Theme



     
     function showPage(pageId) {
        // Object.values(pages).forEach(page => {
        //     if (page) page.classList.remove('visible');
        // });
        // if(pages[pageId]) pages[pageId].classList.add('visible');

        if (pageId === 'Home') {
           window.location.href = "userhome.html";
        }
        if (pageId === 'MyReports') {
           
                window.location.href = "my-reports.html";
           
        }
        if (pageId === 'Analytics') {
           
                window.location.href = "analytics.html";
           
        }
         if (pageId === 'Logout') {
           
                window.location.href = "home.html";
           
        }
        
    }



    function setupHeader() {
        const headerControls = document.getElementById('header-controls');
        headerControls.innerHTML = `
            <button id="all-issues-btn">Home</button>
            <button id="admin-view-btn">My Reports</button>
            <button id="admin-view-btn2">Analytics</button>
            <button id="admin-view-btn3">Logout</button>
            
            <button id="theme-toggle-btn" title="Toggle Theme">
                <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.752-2.648z" /></svg>
            </button>
        `;
        document.getElementById('all-issues-btn').addEventListener('click', () => showPage('Home'));
        document.getElementById('admin-view-btn').addEventListener('click', () => showPage('MyReports'));
        document.getElementById('admin-view-btn2').addEventListener('click', () => showPage('Analytics'));
        document.getElementById('admin-view-btn3').addEventListener('click', () => showPage('Logout'));
        document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    }
 // --- Theme Management ---
    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light-theme';
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        applyTheme(newTheme);
    }

const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
    setupHeader();







function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.getElementById('theme-icon');
    if(document.body.classList.contains('dark-theme')){
        icon.innerHTML = `<path d="M21 12.79A9 9 0 0111.21 3a7 7 0 0011.58 9.79z"></path>`;
        icon.setAttribute('stroke', 'white');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        icon.setAttribute('stroke', 'currentColor');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') document.body.classList.add('dark-theme');
    fetchReports();
});

// Fetch reports from backend
async function fetchReports() {
    try {
        const response = await fetch('http://localhost:8080/api/reports'); // Adjust API endpoint
        const reports = await response.json();

        // Update cards
        const total = reports.length;
        const open = reports.filter(r => r.status === "Submitted").length;
        const closed = reports.filter(r => r.status === "resolved").length;
        document.getElementById('total-reports').textContent = total;
        document.getElementById('open-reports').textContent = open;
        document.getElementById('closed-reports').textContent = closed;

        // Populate table
        const tbody = document.getElementById('recent-reports-body');
        tbody.innerHTML = '';
        reports.slice(0, 10).forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.id}</td><td>${r.reporterName}</td><td>${r.status}</td><td>${r.city}</td>`;
            tbody.appendChild(tr);
        });

        // Status Chart
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Open', 'Closed'],
                datasets: [{
                    data: [open, closed],
                    backgroundColor: ['#16A34A', '#EF4444'],
                }]
            },
            options: { responsive: true }
        });

        // Category Chart
        const categories = [...new Set(reports.map(r => r.category))];
        const categoryCounts = categories.map(cat => reports.filter(r => r.category === cat).length);
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Reports by Category',
                    data: categoryCounts,
                    backgroundColor: '#16A34A',
                }]
            },
            options: { responsive: true }
        });

    } catch (err) {
        console.error("Error fetching reports:", err);
    }
}