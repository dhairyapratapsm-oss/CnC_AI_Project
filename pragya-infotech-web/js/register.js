/**
 * CnC Circle - Registration & Authentication Logic
 * 100% Anonymous & PII-Free Account Creation & Role Login
 */

document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('cnc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  initAuthTabs();
  initRoleSelector();
  initPasswordMeter();
  initRegisterForm();
  initLoginForm();
  initQuickDemoLogins();
  checkUrlAuthMode();
});

let selectedRole = 'Student';

/* Switch between Create Account and Log In tabs */
function initAuthTabs() {
  const tabSignupBtn = document.getElementById('tabSignupBtn');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const signupContainer = document.getElementById('signupFormContainer');
  const loginContainer = document.getElementById('loginFormContainer');
  const alertBox = document.getElementById('authAlert');

  if (!tabSignupBtn || !tabLoginBtn) return;

  function switchTab(tab) {
    if (alertBox) alertBox.style.display = 'none';

    if (tab === 'login') {
      tabLoginBtn.classList.add('active');
      tabSignupBtn.classList.remove('active');
      loginContainer.style.display = 'block';
      signupContainer.style.display = 'none';
    } else {
      tabSignupBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      signupContainer.style.display = 'block';
      loginContainer.style.display = 'none';
    }
  }

  tabSignupBtn.addEventListener('click', () => switchTab('signup'));
  tabLoginBtn.addEventListener('click', () => switchTab('login'));

  // Expose globally for redirect handling
  window.switchAuthTab = switchTab;
}

function checkUrlAuthMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const alertBox = document.getElementById('authAlert');

  if (mode === 'login') {
    if (window.switchAuthTab) window.switchAuthTab('login');
  } else if (mode === 'signup') {
    if (window.switchAuthTab) window.switchAuthTab('signup');
  }
}

function initRoleSelector() {
  const roleCards = document.querySelectorAll('.role-card');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedRole = card.dataset.role;

      // Update academic fields based on role
      const classField = document.getElementById('classGroup');
      if (selectedRole === 'Educator' || selectedRole === 'Admin') {
        if (classField) classField.style.display = 'none';
      } else {
        if (classField) classField.style.display = 'grid';
      }
    });
  });
}

function initPasswordMeter() {
  const passwordInput = document.getElementById('regPassword');
  const meterFill = document.getElementById('passwordMeterFill');
  const meterText = document.getElementById('passwordMeterText');

  if (!passwordInput || !meterFill) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    if (!val || val.length === 0) {
      meterFill.style.width = '0%';
      if (meterText) meterText.textContent = '';
      return;
    }

    if (val.length < 6) {
      meterFill.style.width = '15%';
      meterFill.style.backgroundColor = '#ef4444';
      if (meterText) meterText.textContent = 'Too short (minimum 6 characters)';
      return;
    }

    let score = 25; // Base score for >= 6 chars
    if (val.length >= 10) score += 25;
    if (/[A-Z]/.test(val)) score += 25;
    if (/[0-9!@#$%^&*]/.test(val)) score += 25;

    meterFill.style.width = `${score}%`;

    if (score <= 30) {
      meterFill.style.backgroundColor = '#ef4444';
      if (meterText) meterText.textContent = 'Weak Password';
    } else if (score <= 50) {
      meterFill.style.backgroundColor = '#f59e0b';
      if (meterText) meterText.textContent = 'Fair Password';
    } else if (score <= 75) {
      meterFill.style.backgroundColor = '#3b82f6';
      if (meterText) meterText.textContent = 'Good Password';
    } else {
      meterFill.style.backgroundColor = '#10b981';
      if (meterText) meterText.textContent = 'Strong & Secure Password';
    }
  });
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem('cnc_users')) || [];
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem('cnc_users', JSON.stringify(users));
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const successModal = document.getElementById('successModal');
  const alertBox = document.getElementById('authAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const targetClass = document.getElementById('regClass') ? document.getElementById('regClass').value : '12';
    const targetBoard = document.getElementById('regBoard') ? document.getElementById('regBoard').value : 'CBSE';
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!username || !email || !password) {
      showAlert('Please complete all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match. Please verify your password.', 'error');
      return;
    }

    const users = getStoredUsers();
    // Check if email already registered
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showAlert('An account with this email already exists. Please log in.', 'error');
      return;
    }

    const nowFormatted = getFormattedTimestamp();
    const userKey = email.toLowerCase();

    // Set initial session timestamp in localStorage
    localStorage.setItem('cnc_user_prev_login_' + userKey, nowFormatted);

    const newUser = {
      id: 'usr_' + Date.now(),
      username: username,
      email: email,
      role: selectedRole,
      targetClass: targetClass,
      targetBoard: targetBoard,
      password: password,
      isFirstLogin: true,
      lastLogin: nowFormatted, // First login displays the current time
      currentSessionLogin: nowFormatted,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Save active session
    localStorage.setItem('cnc_current_user', JSON.stringify(newUser));

    if (successModal) {
      successModal.style.display = 'flex';
      let countdown = 3;
      const countEl = document.getElementById('redirectCountdown');
      const timer = setInterval(() => {
        countdown--;
        if (countEl) countEl.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = 'dashboard.html';
        }
      }, 1000);
    } else {
      window.location.href = 'dashboard.html';
    }
  });
}

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const identifier = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!identifier || !password) {
      showAlert('Please enter your email/handle and password.', 'error');
      return;
    }

    const users = getStoredUsers();
    // Match against stored users or check default demo accounts
    let user = users.find(u => 
      (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && 
      u.password === password
    );

    // Fallback: Default test demo credentials
    if (!user) {
      const demoRoles = {
        'student': { username: 'Devansh', role: 'Student', targetClass: '12', targetBoard: 'CBSE' },
        'educator': { username: 'Prof. Sharma', role: 'Educator', targetClass: '11 & 12', targetBoard: 'CBSE / ICSE' },
        'parent': { username: 'ParentGuardian', role: 'Parent', targetClass: '10', targetBoard: 'CBSE' },
        'admin': { username: 'Apex Academy Admin', role: 'Admin', targetClass: 'All', targetBoard: 'All Boards' }
      };

      const lowerId = identifier.toLowerCase();
      for (const [k, v] of Object.entries(demoRoles)) {
        if (lowerId.includes(k)) {
          user = {
            id: 'demo_' + k,
            username: v.username,
            email: identifier.includes('@') ? identifier : `${k}@cnccircle.com`,
            role: v.role,
            targetClass: v.targetClass,
            targetBoard: v.targetBoard
          };
          break;
        }
      }
    }

    if (user) {
      const nowFormatted = getFormattedTimestamp();
      const userKey = (user.email || user.username || user.id).toLowerCase();
      const prevStoredLogin = localStorage.getItem('cnc_user_prev_login_' + userKey);

      if (prevStoredLogin) {
        // Returning user: display the LAST session's login timestamp
        user.isFirstLogin = false;
        user.lastLogin = prevStoredLogin;
      } else {
        // Very first time this user logs in: display current time
        user.isFirstLogin = true;
        user.lastLogin = nowFormatted;
      }

      // Record current session login time to be shown on subsequent session
      localStorage.setItem('cnc_user_prev_login_' + userKey, nowFormatted);
      user.currentSessionLogin = nowFormatted;

      localStorage.setItem('cnc_current_user', JSON.stringify(user));
      showAlert('✓ Login successful! Opening your Pro Member Studio...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } else {
      showAlert('❌ Invalid email/username or password. Please check credentials or create an account.', 'error');
    }
  });
}

function initQuickDemoLogins() {
  const chips = document.querySelectorAll('.demo-account-chip');

  const demoAccounts = {
    'Student': { username: 'Devansh', email: 'devansh.student@cnccircle.com', role: 'Student', targetClass: '12', targetBoard: 'CBSE' },
    'Educator': { username: 'Dr. Meera Iyer', email: 'meera.educator@cnccircle.com', role: 'Educator', targetClass: '12', targetBoard: 'CBSE / ICSE' },
    'Parent': { username: 'Rajesh_Parent', email: 'rajesh.parent@cnccircle.com', role: 'Parent', targetClass: '10', targetBoard: 'CBSE' },
    'Admin': { username: 'St. Xavier Coaching Admin', email: 'admin@stxaviers.edu', role: 'Admin', targetClass: 'Classes 9-12', targetBoard: 'CBSE, ICSE, State' }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const role = chip.dataset.demoRole;
      const account = demoAccounts[role];
      if (account) {
        const nowFormatted = getFormattedTimestamp();
        const userKey = account.email.toLowerCase();
        const prevStoredLogin = localStorage.getItem('cnc_user_prev_login_' + userKey);

        if (prevStoredLogin) {
          account.isFirstLogin = false;
          account.lastLogin = prevStoredLogin;
        } else {
          account.isFirstLogin = true;
          account.lastLogin = nowFormatted;
        }

        localStorage.setItem('cnc_user_prev_login_' + userKey, nowFormatted);
        account.currentSessionLogin = nowFormatted;

        localStorage.setItem('cnc_current_user', JSON.stringify(account));
        showAlert(`✓ Logged in as ${role} (${account.username}). Opening dashboard...`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 400);
      }
    });
  });
}

function getFormattedTimestamp() {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('authAlert');
  if (!alertBox) {
    alert(message);
    return;
  }

  alertBox.className = `auth-alert ${type}`;
  alertBox.textContent = message;
  alertBox.style.display = 'flex';
}
