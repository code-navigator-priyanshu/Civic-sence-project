// ================== REPORTS PAGE ==================
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:8080/api/reports";
  const container = document.getElementById("my-issues-list-container");
  const notif = document.getElementById("notification-container");

  const userEmail = localStorage.getItem("civic-reporter-user-email");
  if (!userEmail) {
    toast("You must be logged in to view reports", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 2000);
    return;
  }

  const filterCategory = document.getElementById("filter-category");
  const filterStatus = document.getElementById("filter-status");
  const filterBtn = document.getElementById("filter-btn");

  // --- Toast Notifications ---
  function toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    notif.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => el.remove(), 4000);
  }

  // --- Fetch Reports ---
  async function fetchReports(filters = {}) {
    try {
      let query = `?reporterEmail=${userEmail}`;

      if (filters.category) {
        console.log("filter category", filters.category);
        query += `&category=${filters.category}`;
      }

      if (filters.status) {
        console.log("filter status", filters.status);
        let cat = "";
        if (filters.status === "in-progress") cat = "inprogress";
        else if (filters.status === "resolved") cat = "resolved";
        else if (filters.status === "submitted") cat = "submitted";

        console.log("mapped status", cat);
        query += `&status=${cat}`;
      }

      const res = await fetch(`${API_URL}${query}`);
      if (!res.ok) throw new Error("Failed to fetch reports");

      const reports = await res.json();
      renderReports(reports);
    } catch (err) {
      toast(err.message, "error");
    }
  }

  // --- Render Reports ---
  function renderReports(reports) {
    container.innerHTML = "";
    if (!reports.length) {
      container.innerHTML = `<p class="no-issues-message">No reports found.</p>`;
      return;
    }

    reports.forEach(report => {
      const card = document.createElement("div");
      card.className = "issue-item";
      const status = report.status ? report.status.toLowerCase() : "submitted";

      card.innerHTML = `
        <div class="issue-item-header">
          <h3>${report.category}</h3>
          <span class="issue-item-status ${status}">
            ${report.status || "Submitted"}
          </span>
        </div>
        <p class="issue-item-address">📍 ${report.street}, ${report.city} (${report.pincode})</p>
        <p>${report.description || "No description provided."}</p>
        <div class="report-actions">
          <button class="edit-btn" data-id="${report.id}">Edit</button>
          <button class="delete-btn" data-id="${report.id}">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });

    // --- Edit Buttons ---
    document.querySelectorAll(".edit-btn").forEach(btn =>
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        window.location.href = `report.html?id=${id}`;
      })
    );

    // --- Delete Buttons ---
    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!confirm("Are you sure you want to delete this report?")) return;

        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
          toast("Report deleted successfully");
          fetchReports(getFilters());
        } catch (err) {
          toast(err.message, "error");
        }
      })
    );
  }

  // --- Get Active Filters ---
  function getFilters() {
    return {
      category: filterCategory.value,
      status: filterStatus.value
    };
  }

  // --- Apply Filter ---
  filterBtn.addEventListener("click", () => fetchReports(getFilters()));

  // --- Initial Fetch ---
  fetchReports();
});


// ================== HEADER + NAVIGATION ==================
function showPage(pageId) {
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
      <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" 
        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 
          12h-2.25m-.386 6.364l-1.591-1.591M12 
          18.75V21m-4.773-4.227l-1.591 
          1.591M5.25 12H3m4.227-4.773L5.636 
          5.636M15.75 12a3.75 3.75 0 11-7.5 
          0 3.75 3.75 0 017.5 0z" />
      </svg>
      <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" 
        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M21.752 15.002A9.718 9.718 0 0118 
          15.75c-5.385 0-9.75-4.365-9.75-9.75 
          0-1.33.266-2.597.748-3.752A9.753 
          9.753 0 003 11.25c0 5.385 4.365 
          9.75 9.75 9.75 2.572 0 4.92-.99 
          6.752-2.648z" />
      </svg>
    </button>
  `;

  document.getElementById('all-issues-btn').addEventListener('click', () => showPage('Home'));
  document.getElementById('admin-view-btn').addEventListener('click', () => showPage('MyReports'));
  document.getElementById('admin-view-btn2').addEventListener('click', () => showPage('Analytics'));
  document.getElementById('admin-view-btn3').addEventListener('click', () => showPage('Logout'));
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
}

// ================== THEME ==================
function applyTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light-theme';
  const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
  applyTheme(newTheme);
}

// Load saved theme + setup header
const savedTheme = localStorage.getItem('theme') || 'light-theme';
applyTheme(savedTheme);
setupHeader();