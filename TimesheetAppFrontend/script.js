document.addEventListener("DOMContentLoaded", function () {
  const apiBaseUrl = "https://localhost:7207/api"; // backend URL

  // Sections
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const timesheetSection = document.getElementById("timesheetSection");

  // Forms
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const timesheetForm = document.getElementById("timesheetForm");

  // Buttons
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  // Other Elements
  const welcomeMessage = document.getElementById("welcomeMessage");
  const timesheetList = document.getElementById("timesheetList");
  const loginError = document.getElementById("loginError");
  const registerError = document.getElementById("registerError");

  let currentEmployee = null;

  // View Management
  function showLogin() {
    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
    timesheetSection.classList.add("hidden");
  }

  function showRegister() {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    timesheetSection.classList.add("hidden");
  }

  function showTimesheet() {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    timesheetSection.classList.remove("hidden");
    welcomeMessage.textContent = `Welcome, ${currentEmployee.firstName}!`;
    loadTimesheets();
  }
  function hideErrorMessages() {
    loginError.classList.add("hidden");
    registerError.classList.add("hidden");
  }

  function logout() {
    currentEmployee = null;
    sessionStorage.removeItem("currentEmployee");
    sessionStorage.removeItem("jwtToken");
    loginForm.reset();
    registerForm.reset();
    showLogin();
  }

  // api helper
  async function fetchWithAuth(url, options = {}) {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      logout();
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logout();
      return;
    }

    return response;
  }

  // Event Listners
  showRegisterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });
  showLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
  logoutBtn.addEventListener("click", logout);

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    hideErrorMessages();
    const registerDto = {
      firstName: document.getElementById("registerFirstName").value,
      lastName: document.getElementById("registerLastName").value,
      email: document.getElementById("registerEmail").value,
      password: document.getElementById("registerPassword").value,
    };

    fetch(`${apiBaseUrl}/employees/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerDto),
    })
      .then(async (response) => {
        if (response.ok) {
          alert("Registration successful! Please login.");
          registerForm.reset();
          showLogin();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed.");
        }
      })
      .catch((error) => {
        registerError.textContent = error.message;
        registerError.classList.remove("hidden");
      });
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    hideErrorMessages();
    const loginData = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    };

    fetch(`${apiBaseUrl}/employees/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid email or password.");
        }
      })
      .then((data) => {
        currentEmployee = data.employee;
        sessionStorage.setItem("currentEmployee", JSON.stringify(data.employee));
        sessionStorage.setItem("jwtToken", data.token);
        showTimesheet();
      })
      .catch((error) => {
        loginError.textContent = error.message;
        loginError.classList.remove("hidden");
      });
  });

  timesheetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const timesheetId = document.getElementById("timesheetId").value;

    const timesheetDto = {
      date: document.getElementById("timesheetDate").value,
      hoursWorked: parseInt(document.getElementById("hoursWorked").value),
      description: document.getElementById("description").value,
    };

    const method = timesheetId ? "PUT" : "POST";
    const url = timesheetId
      ? `${apiBaseUrl}/timesheets/${timesheetId}`
      : `${apiBaseUrl}/timesheets`;

    try {
      const response = await fetchWithAuth(url, {
        method: method,
        body: JSON.stringify(timesheetDto),
      });

      if (!response.ok) throw new Error("Failed to save timesheet");

      timesheetForm.reset();
      document.getElementById("timesheetId").value = "";
      cancelEditBtn.classList.add("hidden");
      loadTimesheets();
    } catch (error) {
      console.error("Error saving timesheet:", error);
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    timesheetForm.reset();
    document.getElementById("timesheetId").value = "";
    cancelEditBtn.classList.add("hidden");
  });

  // CRUD Functions and Timesheet---
  async function loadTimesheets() {
    if (!currentEmployee) return;

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/timesheets`);
      const data = await response.json();

      timesheetList.innerHTML = "";
      data.forEach((timesheet) => {
        const row = document.createElement("tr");
        const formattedDate = new Date(timesheet.date).toLocaleDateString();
        row.innerHTML = `
          <td>${formattedDate}</td>
          <td>${timesheet.hoursWorked}</td>
          <td>${timesheet.description}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editTimesheet(${timesheet.timesheetId})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTimesheet(${timesheet.timesheetId})">Delete</button>
          </td> `;
        timesheetList.appendChild(row);
    });
    } catch (error) {
      console.error("Error loading timesheets:", error);
    }
  }

  window.editTimesheet = async function (id) {
    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/timesheets/${id}`);
      const timesheet = await response.json();

      document.getElementById("timesheetId").value = timesheet.timesheetId;
      document.getElementById("timesheetDate").value = new Date(timesheet.date).toISOString().split("T")[0];
      document.getElementById("hoursWorked").value = timesheet.hoursWorked;
      document.getElementById("description").value = timesheet.description;
      cancelEditBtn.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching timesheet for edit:", error);
    }
  };

  window.deleteTimesheet = async function (id) {
    if (confirm("Are you sure you want to delete this timesheet?")) {
      try {
        await fetchWithAuth(`${apiBaseUrl}/timesheets/${id}`, { method: "DELETE" });
        loadTimesheets();
      } catch (error) {
        console.error("Error deleting timesheet:", error);
      }
    }
  };
  
  function checkSession() {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    const token = sessionStorage.getItem("jwtToken");
    if (storedEmployee && token) {
      currentEmployee = JSON.parse(storedEmployee);
      showTimesheet();
    } else {
      showLogin();
    }
  }
  checkSession();
});
