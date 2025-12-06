// =======================================
// LOGIN FUNCTION
// =======================================
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-message");

    if (username === "admin" && password === "12345") {
        window.location.href = "dashboard.html";
    } else {
        errorMsg.classList.remove("d-none");
    }
}

// =======================================
// LOGOUT
// =======================================
function logout() {
    window.location.href = "index.html";
}

// =======================================
// EMPLOYEES DATA
// =======================================
const employees = [
    {name:"John Samuel",position:"IT Technician",department:"IT"},
    {name:"Amira Hasan",position:"HR Executive",department:"HR"},
    {name:"Daniel Lee",position:"Accountant",department:"Finance"},
    {name:"Sofia Lim",position:"Marketing Analyst",department:"Marketing"},
    {name:"Farhana Aziz",position:"Software Developer",department:"IT"},
    {name:"Michael Chan",position:"Sales Manager",department:"Sales"},
    {name:"Lily Wong",position:"Customer Support",department:"Customer Service"},
    {name:"Arif Rahman",position:"Network Engineer",department:"IT"},
    {name:"Nur Aisyah",position:"Recruitment Officer",department:"HR"},
    {name:"Jason Yap",position:"Finance Assistant",department:"Finance"},
    {name:"Carmen Lau",position:"Brand Strategist",department:"Marketing"},
    {name:"Hafiz Zain",position:"Software Tester",department:"IT"},
    {name:"Elaine Goh",position:"Payroll Officer",department:"HR"},
    {name:"Victor Tan",position:"Sales Executive",department:"Sales"},
    {name:"Nadia Karim",position:"Customer Care Agent",department:"Customer Service"},
    {name:"Adam Lee",position:"Full Stack Developer",department:"IT"},
    {name:"Queensy Tan",position:"Creative Designer",department:"Marketing"},
    {name:"Rayyan Saad",position:"Finance Auditor",department:"Finance"},
    {name:"Sarah Lim",position:"HR Intern",department:"HR"},
    {name:"Irfan Malik",position:"IT Support",department:"IT"},
    {name:"Rachel Ho",position:"Business Analyst",department:"Finance"},
    {name:"Mira Zulkifli",position:"Digital Marketer",department:"Marketing"},
    {name:"Jordan Ng",position:"Sales Consultant",department:"Sales"},
    {name:"Hannah Ong",position:"Customer Advisor",department:"Customer Service"},
    {name:"Lucas Wong",position:"System Developer",department:"IT"}
];

// =======================================
// DEPARTMENT SUMMARY
// =======================================
function generateDepartmentSummary() {
    const summary = {};
    employees.forEach(emp => {
        summary[emp.department] = (summary[emp.department] || 0) + 1;
    });
    return summary;
}

const departmentSummary = generateDepartmentSummary();
const departments = Object.keys(departmentSummary).map(dep => ({
    name: dep,
    staff: departmentSummary[dep]
}));

// =======================================
// PROJECTS DATA
// =======================================
const projects = [
    { name: "Website Redesign", deadline: "2025-12-10", status: "Ongoing" },
    { name: "Mobile App Launch", deadline: "2026-01-05", status: "Completed" },
    { name: "Marketing Campaign", deadline: "2025-12-20", status: "Pending" },
    { name: "Sales Forecast", deadline: "2025-12-15", status: "Ongoing" },
    { name: "IT Security Audit", deadline: "2025-12-30", status: "Pending" }
];

// =======================================
// RENDER DEPARTMENT CHART
// =======================================
function renderDeptChart() {
    const chartCanvas = document.getElementById("deptChart");
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: departments.map(d => d.name),
            datasets: [{
                label: "Employees Count",
                data: departments.map(d => d.staff),
                borderWidth: 1,
                backgroundColor: "#0d6efd"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// =======================================
// RENDER PROJECTS
// Supports both table and Kanban
// =======================================
function renderProjects() {
    // 1. Table view
    const tableBody = document.querySelector("#projectsTable tbody");
    if (tableBody) {
        tableBody.innerHTML = "";
        projects.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.deadline}</td>
                <td>
                    <span class="badge ${
                        p.status === "Ongoing" ? "bg-primary" :
                        p.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                    }">${p.status}</span>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Doughnut chart for projects
        const chartCanvas = document.getElementById("projectsChart");
        if (chartCanvas) {
            const ctx = chartCanvas.getContext("2d");
            const statusCounts = { Pending: 0, Ongoing: 0, Completed: 0 };
            projects.forEach(p => statusCounts[p.status]++);
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: ["#ffc107","#0d6efd","#198754"]
                    }]
                }
            });
        }
    }

    // 2. Kanban view
    const statuses = ["Pending", "Ongoing", "Completed"];
    statuses.forEach(status => {
        const col = document.getElementById(status);
        if (!col) return;
        col.innerHTML = "";
        projects.filter(p => p.status === status).forEach(p => {
            col.innerHTML += `
                <div class="project-card" style="border-left-color:${
                    status === "Pending" ? "#ffc107" :
                    status === "Ongoing" ? "#0d6efd" : "#198754"
                }" onclick="openProject('${p.name}','${p.deadline}','${p.status}')">
                    <h5 class="fw-bold">${p.name}</h5>
                    <p class="mb-1"><i class="bi bi-calendar-event"></i> ${p.deadline}</p>
                    <span class="badge ${
                        status === "Pending" ? "bg-warning text-dark" :
                        status === "Ongoing" ? "bg-primary" : "bg-success"
                    }">${status}</span>
                </div>
            `;
        });
    });

    // Update Kanban status counts
    if (document.getElementById("pendingCount")) document.getElementById("pendingCount").innerText = projects.filter(p => p.status === "Pending").length;
    if (document.getElementById("ongoingCount")) document.getElementById("ongoingCount").innerText = projects.filter(p => p.status === "Ongoing").length;
    if (document.getElementById("completedCount")) document.getElementById("completedCount").innerText = projects.filter(p => p.status === "Completed").length;

    // Kanban doughnut chart
    const chartCanvas = document.getElementById("projectChart");
    if (chartCanvas) {
        const ctx = chartCanvas.getContext("2d");
        const statusCounts = { Pending: 0, Ongoing: 0, Completed: 0 };
        projects.forEach(p => statusCounts[p.status]++);
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ["#ffc107","#0d6efd","#198754"]
                }]
            }
        });
    }
}

// =======================================
// MODAL OPEN FUNCTION FOR KANBAN
// =======================================
function openProject(name, deadline, status) {
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    if (!modalTitle || !modalBody) return;

    modalTitle.innerText = name;
    modalBody.innerHTML = `
        <p><strong>Deadline:</strong> ${deadline}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p>This project is part of the Company's Management System.</p>
    `;

    new bootstrap.Modal(document.getElementById("projectModal")).show();
}

// =======================================
// SCROLL TO KANBAN COLUMN
// =======================================
function scrollToColumn(status) {
    const col = document.getElementById(status);
    if (col) col.scrollIntoView({ behavior: "smooth" });
}

// =======================================
// HIGHLIGHT NAVBAR
// =======================================
function highlightNavbar() {
    const currentPage = location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === currentPage);
    });
}

// =======================================
// DARK MODE TOGGLE (optional)
// =======================================
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// =======================================
// DOMContentLoaded
// =======================================
document.addEventListener("DOMContentLoaded", () => {
    highlightNavbar();
    renderDeptChart();
    renderProjects();
});
