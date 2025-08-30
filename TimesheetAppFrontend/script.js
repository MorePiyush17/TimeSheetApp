const apiBaseUrl = "https://localhost:7207/api";

// ---------------- REGISTER ----------------
async function register() {
  const employee = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(`${apiBaseUrl}/Employees/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    });

    if (res.ok) {
      alert("Registered successfully! Please login.");
      window.location.href = "login.html";
    } else {
      const error = await res.text();
      console.error("Registration failed:", error);
      alert("Registration failed: " + error);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
}

// ---------------- LOGIN ----------------
async function login() {
  const user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(`${apiBaseUrl}/Employees/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("employeeId", data.employeeId || data.employee?.employeeId);
      window.location.href = "timesheets.html";
    } else {
      const errorText = await res.text();
      alert("Login failed! " + errorText);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
}

// ---------------- LOAD TIMESHEETS ----------------
async function loadTimesheets() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`${apiBaseUrl}/Timesheets`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    const tbody = document.getElementById("timesheetTable");
    tbody.innerHTML = "";

    data.forEach(t => {
  tbody.innerHTML += `
    <tr>
      <td>${t.timesheetId}</td>
      <td>${t.date.split("T")[0]}</td>
      <td>${t.hoursWorked}</td>
      <td>${t.description}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editTimesheet(${t.timesheetId}, '${t.date}', ${t.hoursWorked}, '${t.description}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTimesheet(${t.timesheetId})">Delete</button>
      </td>
    </tr>`;
    
});
  }
}

// ---------------- ADD TIMESHEET ----------------
async function addTimesheet() {
  const token = localStorage.getItem("token");
  const body = {
    date: document.getElementById("date").value,
    hoursWorked: parseInt(document.getElementById("hoursWorked").value),
    description: document.getElementById("description").value
  };

  const res = await fetch(`${apiBaseUrl}/Timesheets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("Timesheet added!");
    loadTimesheets();
  } else {
    const errorText = await res.text();
    alert("Failed to add timesheet: " + errorText);
  }
}

// ---------------- DELETE TIMESHEET ----------------
  async function deleteTimesheet(id) {
  const confirmDelete = confirm("Are you sure you want to delete this timesheet?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  const res = await fetch(`${apiBaseUrl}/Timesheets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    alert("Deleted!");
    loadTimesheets();
  } else {
    const errorText = await res.text();
    alert("Failed to delete timesheet: " + errorText);
  }
}


// ---------------- LOGOUT ----------------
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

if (window.location.pathname.endsWith("timesheets.html")) {
  loadTimesheets();
}
