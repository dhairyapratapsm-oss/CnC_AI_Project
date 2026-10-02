/**
 * CnC Circle - Main Application Script
 * Concepts & Clarity AI Study System
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserSession();
  initThemeToggle();
  initAiDemoGenerator();
  init3dCube();
  initTabs();
  initProductDemoTabs();
  initPricingSwitch();
  initFaqAccordion();
  initCounters();
  initHoverSounds();
  initParallaxEffect();
  initAuraAiChat();
});

/* ==========================================================================
   User Session, Access Control & Role-Specific Dashboard Engine
   ========================================================================== */

function initUserSession() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('cnc_current_user'));
  } catch (e) {
    user = null;
  }

  const navLoginBtn = document.getElementById('navLoginBtn');
  const navRegisterBtn = document.getElementById('navRegisterBtn');
  const userProfileEl = document.getElementById('userNavProfile');
  const avatarEl = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userDisplayName');
  const roleEl = document.getElementById('userRoleBadge');
  const logoutBtn = document.getElementById('navLogoutBtn');
  const bannerContainer = document.getElementById('rolePortalBannerContainer');

  if (user) {
    // 1. Authenticated User State
    if (navLoginBtn) navLoginBtn.style.display = 'none';
    if (navRegisterBtn) navRegisterBtn.style.display = 'none';
    if (userProfileEl) userProfileEl.style.display = 'flex';

    const displayName = user.username || (user.email ? user.email.split('@')[0] : 'User');
    const initials = displayName.substring(0, 2).toUpperCase();
    const lastLoginEl = document.getElementById('userLastLogin');

    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = displayName;
    if (roleEl) roleEl.textContent = user.role || 'Student';
    if (lastLoginEl) lastLoginEl.textContent = `Last Login: ${user.lastLogin || 'Today'}`;

    // Logout Handler: Clears session and redirects to website landing page
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('cnc_current_user');
        window.location.href = 'index.html';
      });
    }

    // Render Role-Specific Portal Header
    renderRolePortalBanner(user);

    // Pre-fill target class in the AI Generator if user has a preferred class
    if (user.targetClass) {
      const classSelect = document.getElementById('demoClass');
      if (classSelect && ['9', '10', '11', '12'].includes(user.targetClass.toString())) {
        classSelect.value = user.targetClass.toString();
        classSelect.dispatchEvent(new Event('change'));
      }
    }
  } else {
    // 2. Public Guest State (Landing Page works cleanly for everyone)
    if (navLoginBtn) navLoginBtn.style.display = 'inline-flex';
    if (navRegisterBtn) navRegisterBtn.style.display = 'inline-flex';
    if (userProfileEl) userProfileEl.style.display = 'none';
    if (bannerContainer) bannerContainer.innerHTML = '';
  }
}

function renderRolePortalBanner(user) {
  const container = document.getElementById('rolePortalBannerContainer');
  if (!container) return;

  const role = user.role || 'Student';
  const name = user.username || 'Learner';

  const roleConfigs = {
    'Student': {
      icon: '🎓',
      title: `Welcome back, ${name}! [Student Study Mode]`,
      desc: `Class ${user.targetClass || '12'} • ${user.targetBoard || 'CBSE'} Board Track Active. 100% textbook-grounded material generators & instant step derivations ready.`,
      badges: [`🎯 Class ${user.targetClass || '12'} Target`, `📚 NCERT Grounded`, `💎 Pro Studio Active`],
      ctaText: '⚡ Open Pro Study Studio →',
      ctaHref: 'dashboard.html'
    },
    'Educator': {
      icon: '👨‍🏫',
      title: `Welcome back, ${name}! [Educator Lab Active]`,
      desc: `Automated test paper creation and official board marking scheme engine loaded. Build customized class tests with print-ready PDF export.`,
      badges: [`📄 Test Paper Creator`, `🛡️ Board Rubric Verified`, `📥 PDF Export Ready`],
      ctaText: '📄 Open Pro Exam Lab →',
      ctaHref: 'dashboard.html'
    },
    'Parent': {
      icon: '👨‍👩‍👧',
      title: `Welcome back, ${name}! [Parent Progress Portal]`,
      desc: `Monitor textbook syllabus coverage, review step-by-step problem explanations, and ensure mistake-free board exam preparation.`,
      badges: [`📊 Syllabus Tracker`, `🎯 Mistake Prevention`, `🔍 100% Verified`],
      ctaText: '📊 Open Parent Analytics Studio →',
      ctaHref: 'dashboard.html'
    },
    'Admin': {
      icon: '🏫',
      title: `Welcome back, ${name}! [Institution Command Center]`,
      desc: `Manage multi-teacher question generation, custom school watermarked PDF exports, and centralized board question repositories.`,
      badges: [`🏫 Institution Suite`, `🖨️ Branded PDF Export`, `📈 Analytics Ready`],
      ctaText: '🛠️ Open Institution Command Center →',
      ctaHref: 'dashboard.html'
    }
  };

  const config = roleConfigs[role] || roleConfigs['Student'];

  const badgeHtml = config.badges.map(b => `<span class="role-badge-pill">${b}</span>`).join(' ');

  container.innerHTML = `
    <div class="role-portal-banner">
      <div class="role-banner-left">
        <div class="role-banner-icon">${config.icon}</div>
        <div class="role-banner-text">
          <h2>${config.title}</h2>
          <p>${config.desc}</p>
          <div class="role-banner-badges" style="margin-top:0.6rem;">
            ${badgeHtml}
          </div>
        </div>
      </div>
      <div>
        <a href="${config.ctaHref}" class="btn btn-primary btn-lg">${config.ctaText}</a>
      </div>
    </div>
  `;
}

/* Web Audio API - Soft Futuristic Hover Sound Synthesizer */
let audioCtx = null;

function playHoverSound() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    // Audio context fallback
  }
}

function initHoverSounds() {
  const hoverableElements = document.querySelectorAll('.glass-card, .storyboard-step, .btn, .nav-link, .demo-nav-btn, .cube-nav-btn, .interactive-card, .interactive-image');
  hoverableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playHoverSound();
    });
  });
}

/* ==========================================================================
   3D Knowledge Pipeline Cube Rotation Engine (Mouse Hover, Drag & Controls)
   ========================================================================== */
function init3dCube() {
  const viewport = document.getElementById('cubeViewport');
  const cube = document.getElementById('pipelineCube');
  const prevBtn = document.getElementById('cubeBtnPrev');
  const nextBtn = document.getElementById('cubeBtnNext');
  const faceBtns = document.querySelectorAll('.cube-nav-btn[data-face]');

  if (!viewport || !cube) return;

  let currentY = 0;
  let currentX = -8;
  let isDragging = false;
  let dragStartX = 0;
  let startAngleY = 0;

  function updateCubeTransform(smooth = false) {
    cube.style.transition = smooth ? 'transform 0.45s cubic-bezier(0.2, 1, 0.3, 1)' : 'transform 0.06s ease-out';
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    // Update active navigation button indicator
    const normAngle = ((-currentY % 360) + 360) % 360;
    const faceIndex = Math.round(normAngle / 90) % 4;
    const faceAngles = [0, 90, 180, 270];
    const targetFace = faceAngles[faceIndex];

    faceBtns.forEach(btn => {
      if (parseInt(btn.dataset.face) === targetFace) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 1. Smooth Mouse Hover Rotation across the Viewport
  viewport.addEventListener('mousemove', (e) => {
    if (isDragging) return;

    const rect = viewport.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0 (left) to 1 (right)
    const relY = (e.clientY - rect.top) / rect.height;

    // Smooth subtle vertical tilt
    currentX = -14 + relY * 12;

    // Track horizontal mouse position across 360 degrees when moving over viewport
    // Or smooth incremental mouse movement
    if (e.movementX !== undefined && Math.abs(e.movementX) > 0) {
      currentY += e.movementX * 0.45;
    } else {
      currentY = (relX - 0.5) * 360;
    }

    updateCubeTransform(false);
  });

  // Reset slight tilt on mouse leave
  viewport.addEventListener('mouseleave', () => {
    if (isDragging) return;
    currentX = -8;
    updateCubeTransform(true);
  });

  // 2. Mouse & Touch Dragging for 360-degree manual spin
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    startAngleY = currentY;
    cube.classList.add('grabbing');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    currentY = startAngleY + deltaX * 0.6;
    updateCubeTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      cube.classList.remove('grabbing');
    }
  });

  // Touch Support
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      startAngleY = currentY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    currentY = startAngleY + deltaX * 0.6;
    updateCubeTransform(false);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 3. Navigation Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      // Snap to previous 90 deg face
      currentY += 90;
      updateCubeTransform(true);
      playHoverSound();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // Snap to next 90 deg face
      currentY -= 90;
      updateCubeTransform(true);
      playHoverSound();
    });
  }

  faceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const faceAngle = parseInt(btn.dataset.face);
      currentY = -faceAngle;
      updateCubeTransform(true);
      playHoverSound();
    });
  });

  // Initial transform render
  updateCubeTransform(true);
}

/* Card Parallax Effect */
function initParallaxEffect() {
  const cards = document.querySelectorAll('.storyboard-step, .glass-card, .playground-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* Theme Switcher (Global & Idempotent) */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('cnc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeBtn) {
    themeBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';

    // Prevent duplicate listener registration across multiple script files
    if (themeBtn.dataset.themeInit === 'true') return;
    themeBtn.dataset.themeInit = 'true';

    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('cnc-theme') || 'dark';
      const newTheme = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cnc-theme', newTheme);
      themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });
  }
}

/* Comprehensive Chapter Dataset across Physics, Chemistry, Mathematics (Classes 9-12) */
const chapterData = {
  physics: {
    "12": [
      "Electric Charges & Fields",
      "Electrostatic Potential & Capacitance",
      "Current Electricity",
      "Moving Charges & Magnetism",
      "Magnetism & Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics & Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation & Matter",
      "Atoms & Nuclei",
      "Semiconductor Electronics"
    ],
    "11": [
      "Units & Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane & Projectile",
      "Laws of Motion & Friction",
      "Work, Energy & Power",
      "System of Particles & Rotational Motion",
      "Gravitation & Orbital Mechanics",
      "Mechanical Properties of Fluids",
      "Thermodynamics & Heat Engine",
      "Kinetic Theory of Gases",
      "Oscillations & SHM",
      "Waves & Sound Propagation"
    ],
    "10": [
      "Light - Reflection & Refraction",
      "The Human Eye & Colourful World",
      "Electricity & Ohm's Law",
      "Magnetic Effects of Electric Current",
      "Sources of Energy & Conservation"
    ],
    "9": [
      "Motion & Speed-Time Graphs",
      "Force & Laws of Motion",
      "Gravitation & Universal Constant",
      "Work & Energy Calculations",
      "Sound & Ultrasound Applications"
    ]
  },
  chemistry: {
    "12": [
      "Solutions & Colligative Properties",
      "Electrochemistry & Nernst Equation",
      "Chemical Kinetics & Reaction Rates",
      "d and f Block Elements",
      "Coordination Compounds & Ligands",
      "Haloalkanes & Haloarenes",
      "Alcohols, Phenols & Ethers",
      "Aldehydes, Ketones & Carboxylic Acids",
      "Amines & Nitrogen Derivatives",
      "Biomolecules & Nucleic Acids"
    ],
    "11": [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom & Quantum Numbers",
      "Periodic Table & Periodicity",
      "Chemical Bonding & Molecular Structure",
      "Thermodynamics & Enthalpy Changes",
      "Chemical & Ionic Equilibrium",
      "Redox Reactions & Oxidation Numbers",
      "Organic Chemistry - Basic Principles",
      "Hydrocarbons (Alkanes, Alkenes, Alkynes)"
    ],
    "10": [
      "Chemical Reactions & Equations",
      "Acids, Bases & Salts",
      "Metals & Non-metals",
      "Carbon & Its Compounds",
      "Periodic Classification of Elements"
    ],
    "9": [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure?",
      "Atoms & Molecules",
      "Structure of the Atom"
    ]
  },
  mathematics: {
    "12": [
      "Relations & Functions",
      "Inverse Trigonometric Functions",
      "Matrices & Matrix Algebra",
      "Determinants & Cramer's Rule",
      "Continuity & Differentiability",
      "Application of Derivatives",
      "Integrals & Indefinite Integration",
      "Definite Integrals & Bounded Area",
      "Differential Equations",
      "Vector Algebra & Dot Product",
      "Three Dimensional Geometry",
      "Linear Programming Problems",
      "Probability & Bayes' Theorem"
    ],
    "11": [
      "Sets, Relations & Mappings",
      "Trigonometric Functions & Identities",
      "Complex Numbers & Quadratic Equations",
      "Linear Inequalities",
      "Permutations & Combinations",
      "Binomial Theorem",
      "Sequences & Series (AP, GP)",
      "Straight Lines & Slope",
      "Conic Sections (Parabola, Ellipse, Hyperbola)",
      "Limits & Derivatives",
      "Statistics & Standard Deviation",
      "Probability Theory"
    ],
    "10": [
      "Real Numbers & Euclid Division",
      "Polynomials & Factor Theorem",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations & Discriminant",
      "Arithmetic Progressions (AP)",
      "Triangles & Similarity Theorems",
      "Coordinate Geometry & Distance Formula",
      "Introduction to Trigonometry",
      "Some Applications of Trigonometry",
      "Circles & Tangent Properties",
      "Surface Areas & Volumes of Solids",
      "Statistics & Cumulative Frequency"
    ],
    "9": [
      "Number Systems & Irrational Numbers",
      "Polynomials & Algebraic Identities",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry",
      "Lines & Angles",
      "Triangles & Congruence",
      "Quadrilaterals & Parallelograms",
      "Circles & Theorems",
      "Heron's Formula for Area",
      "Surface Areas & Volumes",
      "Statistics & Histograms"
    ]
  }
};

/* Sample Dynamic Question Generator Engine */
function generateQuestionContent(subject, classLevel, chapter) {
  const templates = {
    physics: {
      type: "Concept Breakdown & Numerical",
      question: `Define the core principles governing ${chapter} in Class ${classLevel} Physics. Derive the primary governing equation and analyze how key parameters scale.`,
      solution: `In ${chapter}, the behavior of fields and energy distribution is governed by fundamental conservation laws and field vector superpositions.`,
      formulas: ["E = F / q₀", "V = W / q", "Φ = ∮ E · dA = Q_encl / ε₀"],
      steps: [
        `Step 1: Identify boundary conditions and source charges for ${chapter}.`,
        `Step 2: Apply Gauss's Law / Field Superposition integral over defined closed surface.`,
        `Step 3: Solve for scalar potential V and vector intensity E, converting to standard SI units.`
      ]
    },
    chemistry: {
      type: "Mechanism & Quantitative Analysis",
      question: `Explain the reaction mechanism and thermodynamics behind ${chapter} for Class ${classLevel} Chemistry. Calculate the equilibrium constant and standard cell potential.`,
      solution: `The chemical system in ${chapter} operates via selective molecular collision frequencies and activation energy barriers described by Arrhenius & Nernst relations.`,
      formulas: ["E_cell = E° - (0.0591 / n) log Q", "ΔG° = -n F E°_cell", "k = A e^(-Ea / RT)"],
      steps: [
        `Step 1: Write balanced redox / stoichiometry equation for ${chapter}.`,
        `Step 2: Determine oxidation states and calculate standard potential E° = E°_cathode - E°_anode.`,
        `Step 3: Substitute concentration values into Nernst Equation to find non-standard cell potential.`
      ]
    },
    mathematics: {
      type: "Step-by-Step Proof & Problem Solving",
      question: `Solve the fundamental boundary value problem for ${chapter} in Class ${classLevel} Mathematics. Show all intermediate differentiation and integration steps.`,
      solution: `The mathematical formulation for ${chapter} requires establishing continuity, applying standard substitution identities, and evaluating definite boundary integrals.`,
      formulas: ["∫₀ᵃ f(x) dx = ∫₀ᵃ f(a-x) dx", "d/dx [u/v] = (v u' - u v') / v²", "det(A - λI) = 0"],
      steps: [
        `Step 1: Apply change of variable substitution to simplify integrand in ${chapter}.`,
        `Step 2: Utilize definite integral symmetry properties to combine terms: 2I = ∫₁² 1 dx.`,
        `Step 3: Evaluate antiderivative at upper and lower limits to arrive at exact analytical solution.`
      ]
    }
  };

  return templates[subject] || templates.physics;
}

function initAiDemoGenerator() {
  const generateBtn = document.getElementById('generateDemoBtn');
  const subjectSelect = document.getElementById('demoSubject');
  const classSelect = document.getElementById('demoClass');
  const chapterSelect = document.getElementById('demoChapter');
  const outputBox = document.getElementById('demoOutputBox');

  if (!generateBtn || !outputBox) return;

  function updateChapters() {
    const subj = subjectSelect.value;
    const cls = classSelect.value;
    chapterSelect.innerHTML = '';
    
    if (chapterData[subj] && chapterData[subj][cls]) {
      chapterData[subj][cls].forEach(chap => {
        const opt = document.createElement('option');
        opt.value = chap;
        opt.textContent = chap;
        chapterSelect.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = "General Concepts";
      opt.textContent = "General Board Concepts & Solved Problems";
      chapterSelect.appendChild(opt);
    }
  }

  subjectSelect.addEventListener('change', updateChapters);
  classSelect.addEventListener('change', updateChapters);
  updateChapters();

  generateBtn.addEventListener('click', () => {
    outputBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem; color:var(--primary); font-weight:600; padding:1.5rem 0;">
        <div class="pulse-dot"></div> Synthesizing Textbook-Grounded Board Question & Solution for ${chapterSelect.value}...
      </div>
    `;

    setTimeout(() => {
      const subj = subjectSelect.value;
      const cls = classSelect.value;
      const chap = chapterSelect.value;

      const item = generateQuestionContent(subj, cls, chap);

      let formulaHtml = item.formulas.map(f => `<span class="formula-chip">${f}</span>`).join(' ');
      let stepsHtml = item.steps.map(s => `<li style="margin-bottom:0.4rem;">${s}</li>`).join('');

      outputBox.innerHTML = `
        <div style="margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <span class="cnc-tag-badge">${item.type}</span>
          <span class="cnc-grounded-tag">✓ 100% Board Grounded (${subj.toUpperCase()} CLASS ${cls})</span>
        </div>
        <h4 style="font-size:1.1rem; margin-bottom:0.75rem; color:var(--text-main); line-height:1.4;">${item.question}</h4>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:0.75rem;">${item.solution}</p>
        <div style="margin-bottom:0.75rem;">
          <strong style="font-size:0.85rem; color:var(--secondary); display:block; margin-bottom:0.25rem;">KEY FORMULAS & IDENTITIES:</strong>
          ${formulaHtml}
        </div>
        <div class="solution-steps-box">
          <strong style="font-size:0.85rem; color:var(--accent-purple); display:block; margin-bottom:0.4rem;">AI STEP-BY-STEP SOLUTION:</strong>
          <ol style="padding-left:1.2rem; font-size:0.88rem;">
            ${stepsHtml}
          </ol>
        </div>
      `;
    }, 600);
  });
}

/* Main Role Tabs Switcher */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

/* Product Demo Interactive Tabs */
function initProductDemoTabs() {
  const demoNavBtns = document.querySelectorAll('.demo-nav-btn');
  const demoPanels = document.querySelectorAll('.demo-panel');

  demoNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      demoNavBtns.forEach(b => b.classList.remove('active'));
      demoPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.demo);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* Pricing Billing Switch */
function initPricingSwitch() {
  const toggle = document.getElementById('pricingToggle');
  const prices = document.querySelectorAll('.price-val');

  if (!toggle) return;

  function updatePrices() {
    const isAnnual = toggle.checked;
    prices.forEach(price => {
      const monthly = price.dataset.monthly;
      const annual = price.dataset.annual;
      if (price.dataset.annual) {
        price.textContent = isAnnual ? `₹${annual}` : `₹${monthly}`;
      }
    });
  }

  toggle.addEventListener('change', updatePrices);
  updatePrices();
}

/* FAQ Accordion */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

/* Counter Animation */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    if (animated) return;
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      animated = true;
      counters.forEach(counter => {
        const target = +counter.dataset.target;
        const speed = 200;
        const inc = target / speed;
        let count = 0;

        const update = () => {
          count += inc;
          if (count < target) {
            counter.innerText = Math.ceil(count).toLocaleString('en-IN');
            setTimeout(update, 15);
          } else {
            counter.innerText = target.toLocaleString('en-IN') + (counter.dataset.suffix || '');
          }
        };
        update();
      });
    }
  }

  window.addEventListener('scroll', runCounters);
  runCounters();
}

/* ==========================================================================
   Aura AI Chat Support & Draggable Popup Engine
   ========================================================================== */

function initAuraAiChat() {
  const launcher = document.getElementById('chatLauncherBtn');
  const chatWindow = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const minimizeBtn = document.getElementById('chatMinimizeBtn');
  const dragHeader = document.getElementById('chatDragHeader');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chips = document.querySelectorAll('.chat-chip');

  if (!launcher || !chatWindow) return;

  let chatWindowMovedByUser = false;

  function openChatWindow() {
    chatWindow.classList.add('active');
    if (chatInput) chatInput.focus();
    playHoverSound();

    // Position chat window smartly next to the launcher if not moved manually
    if (!chatWindowMovedByUser) {
      const launcherRect = launcher.getBoundingClientRect();
      const chatWidth = chatWindow.offsetWidth || 380;
      const chatHeight = chatWindow.offsetHeight || 540;

      let targetLeft = launcherRect.right - chatWidth;
      let targetTop = launcherRect.top - chatHeight - 14;

      if (targetTop < 10) {
        // Place below launcher if not enough room above
        targetTop = launcherRect.bottom + 14;
      }

      targetLeft = Math.max(10, Math.min(targetLeft, window.innerWidth - chatWidth - 10));
      targetTop = Math.max(10, Math.min(targetTop, window.innerHeight - chatHeight - 10));

      chatWindow.style.right = 'auto';
      chatWindow.style.bottom = 'auto';
      chatWindow.style.left = `${targetLeft}px`;
      chatWindow.style.top = `${targetTop}px`;
    }
  }

  function toggleChatWindow() {
    if (chatWindow.classList.contains('active')) {
      chatWindow.classList.remove('active');
    } else {
      openChatWindow();
    }
  }

  // 1. Make Floating Launcher Button Draggable & Clickable
  makeDraggable(launcher, null, {
    onClick: () => {
      toggleChatWindow();
    }
  });

  // 2. Make Chat Window Popup Draggable via Header Bar
  makeDraggable(chatWindow, dragHeader, {
    onDragStart: () => {
      chatWindowMovedByUser = true;
    }
  });

  // Keep elements within viewport upon window resize
  window.addEventListener('resize', () => {
    clampElementToViewport(launcher);
    clampElementToViewport(chatWindow);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('active');
    });
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('active');
    });
  }

  // Quick suggestion chips handler
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query || chip.innerText;
      addUserMessage(query);
      generateAiResponse(query);
    });
  });

  // Chat Form Submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      addUserMessage(query);
      chatInput.value = '';
      generateAiResponse(query);
    });
  }

  function addUserMessage(text) {
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMessage(html) {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <img src="assets/ai_avatar_girl.png" alt="Aura AI" class="chat-msg-avatar" />
      <div class="chat-bubble">${html}</div>
    `;
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateAiResponse(query) {
    const raw = query.trim();
    const lower = raw.toLowerCase();

    // Show quick typing indicator
    const typingId = 'typing_' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.id = typingId;
    typingMsg.className = 'chat-msg bot';
    typingMsg.innerHTML = `
      <img src="assets/ai_avatar_girl.png" alt="Aura AI" class="chat-msg-avatar" />
      <div class="chat-bubble" style="color:var(--text-muted); font-style:italic;">
        <span class="pulse-dot" style="display:inline-block; width:6px; height:6px; margin-right:4px;"></span> Aura is thinking...
      </div>
    `;
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const el = document.getElementById(typingId);
      if (el) el.remove();

      let reply = "";

      // 1. GREETINGS & PERSONAL IDENTITY
      if (
        lower.includes("how are you") || 
        lower.includes("how r u") || 
        lower.includes("how do you do") ||
        lower.includes("how's it going") ||
        lower.includes("how is it going")
      ) {
        reply = "😊 I'm doing great, thank you! I'm <strong>Aura</strong>, your AI study assistant at CnC Circle. How can I help you today with your Physics, Chemistry, or Maths board exam prep?";
      } else if (
        lower.includes("who are you") || 
        lower.includes("what is your name") || 
        lower.includes("what are you") ||
        lower.includes("introduce yourself")
      ) {
        reply = "✨ Hi! I'm <strong>Aura</strong>, the AI study companion for <strong>CnC Circle</strong>. I can solve board exam doubts, explain Physics/Chemistry/Maths formulas, and show you how to generate custom test papers!";
      } else if (
        lower.includes("what can you do") || 
        lower.includes("help me") || 
        lower.includes("your features") ||
        lower.includes("how can you help")
      ) {
        reply = "🎯 <strong>Here is what I can do for you:</strong><br>• Explain board exam concepts & derivations (Physics, Chem, Maths).<br>• Give instant formula cheat-sheets & SI units.<br>• Guide you on using the <strong>Test Paper Creator</strong> & PDF export.<br>• Provide details on <strong>CnC Circle plans & pricing</strong>.";
      } else if (
        lower.startsWith("hi") || 
        lower.startsWith("hello") || 
        lower.startsWith("hey") || 
        lower.includes("good morning") || 
        lower.includes("good afternoon") || 
        lower.includes("good evening")
      ) {
        reply = "👋 Hello there! Welcome to <strong>CnC Circle</strong>. What topic or subject would you like to explore today?";
      } else if (
        lower.includes("thank") || 
        lower.includes("thanks") || 
        lower.includes("thx")
      ) {
        reply = "🌟 You're very welcome! Best of luck with your study sessions. Let me know if you need any more derivations, questions, or formulas!";
      } else if (
        lower.includes("bye") || 
        lower.includes("goodbye") || 
        lower.includes("good night") || 
        lower.includes("see you")
      ) {
        reply = "👋 Goodbye! Have a productive study session, and feel free to come back whenever you have a doubt!";
      } else if (
        lower.includes("are you real") || 
        lower.includes("are you human") || 
        lower.includes("are you ai") ||
        lower.includes("who built you") ||
        lower.includes("who made you")
      ) {
        reply = "🤖 I'm an intelligent AI study assistant created for <strong>CnC Circle (Concepts & Clarity AI)</strong>, trained to provide 100% textbook-grounded answers!";
      }

      // 2. PRICING, PLANS, COURSE COST & DISCOUNTS
      else if (
        lower.includes("price") || 
        lower.includes("pricing") || 
        lower.includes("cost") || 
        lower.includes("course price") || 
        lower.includes("plan") || 
        lower.includes("plans") || 
        lower.includes("how much") || 
        lower.includes("fee") || 
        lower.includes("fees") || 
        lower.includes("subscription") || 
        lower.includes("discount") || 
        lower.includes("annual") || 
        lower.includes("monthly")
      ) {
        reply = `💎 <strong>CnC Circle Pricing Plans:</strong><br>
• <strong>Student Starter:</strong> <code>₹0 Free Forever</code> (50 AI questions/mo + formulas).<br>
• <strong>Pro Study Circle:</strong> <code>₹399/mo</code> <em>(Annual - Save 20%)</em> or <code>₹499/mo</code> monthly (Unlimited AI practice + Test Paper Creator + PDF export).<br>
• <strong>Institution & School:</strong> <code>₹1,999/mo</code> <em>(Annual)</em> for coaching centers & up to 10 teachers.<br>
👉 <em>You can switch between Monthly and Annual billing in the Pricing section!</em>`;
      }

      // 3. PRODUCT TOOLS (Test Generator, PDF Export, Accuracy, Privacy, Roles)
      else if (
        lower.includes("test paper") || 
        lower.includes("test maker") || 
        lower.includes("test creator") || 
        lower.includes("generate test") || 
        lower.includes("create paper") ||
        lower.includes("question paper")
      ) {
        reply = "📄 <strong>Automated Test Paper Creator:</strong><br>1. Go to the <strong>Product Demo</strong> section or log in as an Educator.<br>2. Select subject, class, and difficulty (Easy, Medium, Hard).<br>3. CnC compiles board-aligned questions with official step marking schemes ready for 1-click printable PDF export!";
      } else if (
        lower.includes("pdf export") || 
        lower.includes("download pdf") || 
        lower.includes("watermark") || 
        lower.includes("print")
      ) {
        reply = "📥 <strong>Print-Ready PDF Engine:</strong> Export clean test papers with or without answer keys, step-by-step marking rubrics, and custom school watermarks for class distribution.";
      } else if (
        lower.includes("grounding") || 
        lower.includes("ncert") || 
        lower.includes("accuracy") || 
        lower.includes("hallucination") || 
        lower.includes("syllabus")
      ) {
        reply = "🛡️ <strong>99.6% Board Grounding:</strong> Our multi-stage AI pipeline vector-indexes official CBSE, ICSE, and NCERT textbooks, guaranteeing zero hallucinations and exact step mark allocations.";
      } else if (
        lower.includes("pii") || 
        lower.includes("mobile") || 
        lower.includes("privacy") || 
        lower.includes("phone number") || 
        lower.includes("personal data")
      ) {
        reply = "🔒 <strong>100% Privacy & PII-Free:</strong> We never collect phone numbers, OTPs, or personal tracking data. All you need to join is a simple username handle and email.";
      } else if (
        lower.includes("subject") || 
        lower.includes("class") || 
        lower.includes("board") || 
        lower.includes("cbse") || 
        lower.includes("icse")
      ) {
        reply = "📚 <strong>Curriculum Coverage:</strong> Classes <strong>9, 10, 11, and 12</strong> across <strong>Physics, Chemistry, and Mathematics</strong> for CBSE, ICSE / ISC, and State Boards.";
      } else if (
        lower.includes("register") || 
        lower.includes("create account") || 
        lower.includes("sign up") || 
        lower.includes("login") || 
        lower.includes("log in")
      ) {
        reply = "🔐 <strong>Account & Onboarding:</strong> Click <em>'Join CnC Circle'</em> or <em>'Log In'</em> in the navigation bar. Choose your role (Student, Educator, Parent, Admin) for customized portal features!";
      }

      // 4. ACADEMIC CONCEPTS & FORMULAS (Physics, Chemistry, Mathematics)
      else if (lower.includes("ohm") || lower.includes("resistance") || lower.includes("v=ir")) {
        reply = "⚡ <strong>Ohm's Law:</strong> Current through a conductor between two points is directly proportional to voltage across the points at constant temperature.<br>• Formula: <code>V = I · R</code><br>• Resistance: <code>R = ρ(L / A)</code> (Units: Ohms, Ω)";
      } else if (lower.includes("gauss") || lower.includes("electric flux")) {
        reply = "⚡ <strong>Gauss's Law (Electrostatics):</strong> The total electric flux through any closed surface is equal to <code>1/ε₀</code> times the total charge enclosed.<br>• Formula: <code>Φ = ∮ E · dA = Q_enclosed / ε₀</code>";
      } else if (lower.includes("electric field") || lower.includes("coulomb")) {
        reply = "⚡ <strong>Electric Field & Coulomb's Law:</strong><br>• Force: <code>F = (1 / 4πε₀) · (|q₁·q₂| / r²)</code><br>• Field Intensity: <code>E = F / q₀ = (1 / 4πε₀) · (q / r²)</code> (Units: N/C or V/m)";
      } else if (lower.includes("capacitance") || lower.includes("capacitor")) {
        reply = "⚡ <strong>Capacitance:</strong> Ability of a system to store electric charge.<br>• Formula: <code>C = Q / V</code><br>• Parallel Plate: <code>C = (ε₀ · A) / d</code><br>• Energy Stored: <code>U = 1/2 C V² = 1/2 (Q² / C)</code>";
      } else if (lower.includes("lens formula") || lower.includes("mirror formula") || lower.includes("optics") || lower.includes("refraction")) {
        reply = "📐 <strong>Ray Optics Formulas:</strong><br>• Lens Formula: <code>1/f = 1/v - 1/u</code><br>• Mirror Formula: <code>1/f = 1/v + 1/u</code><br>• Snell's Law: <code>n₁ sin θ₁ = n₂ sin θ₂</code><br>• Lens Maker's: <code>1/f = (μ - 1)(1/R₁ - 1/R₂)</code>";
      } else if (lower.includes("gravity") || lower.includes("gravitation") || lower.includes("newton law of gravitation")) {
        reply = "🌌 <strong>Universal Gravitation:</strong> <code>F = G · (m₁ · m₂) / r²</code><br>• Acceleration due to gravity: <code>g = (G · M) / R² ≈ 9.8 m/s²</code><br>• Gravitational Constant: <code>G = 6.674 × 10⁻¹¹ N·m²/kg²</code>";
      } else if (lower.includes("nernst") || lower.includes("electrochemistry") || lower.includes("emf") || lower.includes("cell potential")) {
        reply = "🧪 <strong>Nernst Equation (at 298 K):</strong><br><code>E_cell = E°_cell - (0.0591 / n) · log₁₀(Q)</code><br>• Standard Gibbs Energy: <code>ΔG° = -n · F · E°_cell</code>";
      } else if (lower.includes("arrhenius") || lower.includes("activation energy") || lower.includes("kinetics")) {
        reply = "🧪 <strong>Arrhenius Equation:</strong> Describes temperature dependence of reaction rates.<br>• <code>k = A · e^(-Ea / RT)</code><br>• Linear Form: <code>ln(k) = ln(A) - (Ea / R) · (1/T)</code>";
      } else if (lower.includes("ph ") || lower.includes("acid") || lower.includes("base") || lower.includes("buffer")) {
        reply = "🧪 <strong>pH & Acids/Bases:</strong><br>• <code>pH = -log₁₀[H⁺]</code>, <code>pOH = -log₁₀[OH⁻]</code><br>• At 25°C: <code>pH + pOH = 14</code><br>• Henderson-Hasselbalch: <code>pH = pKa + log([Conjugate Base] / [Acid])</code>";
      } else if (lower.includes("integration") || lower.includes("integral") || lower.includes("calculus")) {
        reply = "📐 <strong>Standard Integration Rules:</strong><br>• Power Rule: <code>∫ xⁿ dx = (x^(n+1)) / (n+1) + C</code> (n ≠ -1)<br>• <code>∫ (1/x) dx = ln|x| + C</code>, <code>∫ eˣ dx = eˣ + C</code><br>• By Parts: <code>∫ u·v dx = u ∫ v dx - ∫ (u' ∫ v dx) dx</code>";
      } else if (lower.includes("derivative") || lower.includes("differentiation")) {
        reply = "📐 <strong>Differentiation Rules:</strong><br>• Product Rule: <code>(u·v)' = u'·v + u·v'</code><br>• Quotient Rule: <code>(u / v)' = (u'·v - u·v') / v²</code><br>• Chain Rule: <code>d/dx[f(g(x))] = f'(g(x)) · g'(x)</code>";
      } else if (lower.includes("matrix") || lower.includes("matrices") || lower.includes("determinant")) {
        reply = "📐 <strong>Matrices & Determinants:</strong><br>• Inverse: <code>A⁻¹ = (1 / det(A)) · adj(A)</code> (valid if det(A) ≠ 0)<br>• Property: <code>det(A·B) = det(A) · det(B)</code>";
      } else if (lower.includes("trigonometry") || lower.includes("sin") || lower.includes("cos") || lower.includes("tan")) {
        reply = "📐 <strong>Key Trigonometric Identities:</strong><br>• <code>sin²θ + cos²θ = 1</code>, <code>1 + tan²θ = sec²θ</code><br>• <code>sin(2θ) = 2 sin θ cos θ</code><br>• <code>cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1</code>";
      } else if (lower.includes("bayes") || lower.includes("probability")) {
        reply = "📊 <strong>Bayes' Theorem:</strong><br><code>P(A|B) = [P(B|A) · P(A)] / P(B)</code><br>Calculates conditional probability of an event given prior knowledge of conditions.";
      }

      // 5. OUT OF SCOPE (Non-academic / unrelated topics handled gracefully)
      else if (
        lower.includes("weather") || 
        lower.includes("movie") || 
        lower.includes("song") || 
        lower.includes("cricket") || 
        lower.includes("football") || 
        lower.includes("stock") || 
        lower.includes("recipe") || 
        lower.includes("cook") || 
        lower.includes("president") || 
        lower.includes("celebrity") || 
        lower.includes("game")
      ) {
        reply = `🎓 I specialize strictly in <strong>Board Exam Studies (Physics, Chemistry, Maths for Classes 9–12)</strong> and the <strong>CnC Circle platform</strong>.<br><br>While questions about general topics like <em>"${escapeHtml(raw)}"</em> are out of my scope, I'd be happy to solve any derivation, formula, or exam question for you!`;
      }

      // 6. DEFAULT INTELLIGENT SEARCH FALLBACK
      else {
        reply = `✨ <strong>Aura's Concept Assistant:</strong> Regarding <em>"${escapeHtml(raw)}"</em>, CnC Circle provides textbook-grounded derivations, practice questions, and formula sheets.<br><br>👉 <strong>Tip:</strong> Try selecting this topic in our <strong>Live Question Synthesizer</strong> above or ask me for specific formulas (e.g. <em>"Ohm's Law"</em>, <em>"Nernst equation"</em>, <em>"Integration rules"</em>, or <em>"Course pricing"</em>)!`;
      }

      addBotMessage(reply);
      playHoverSound();
    }, 450);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/* Helper to clamp element to viewport */
function clampElementToViewport(el) {
  if (!el || !el.style.left) return;
  const rect = el.getBoundingClientRect();
  const maxL = Math.max(8, window.innerWidth - rect.width - 8);
  const maxT = Math.max(8, window.innerHeight - rect.height - 8);
  const curL = parseInt(el.style.left, 10);
  const curT = parseInt(el.style.top, 10);
  if (!isNaN(curL)) el.style.left = `${Math.max(8, Math.min(curL, maxL))}px`;
  if (!isNaN(curT)) el.style.top = `${Math.max(8, Math.min(curT, maxT))}px`;
}

/* Unified Smooth Draggable Engine for Aura AI (Mouse, Touch, Stylus) */
function makeDraggable(element, handle, options = {}) {
  const targetHandle = handle || element;
  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let justDragged = false;

  targetHandle.style.touchAction = 'none';

  function onPointerDown(e) {
    // Ignore interactive controls inside handle
    if (e.target.closest('.chat-btn-icon, button:not(#chatLauncherBtn), input, textarea, a, select')) {
      return;
    }
    // Only primary button or touches
    if (e.button !== undefined && e.button !== 0) return;

    isDragging = true;
    hasMoved = false;
    justDragged = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = element.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    if (targetHandle.setPointerCapture) {
      try {
        targetHandle.setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (!hasMoved && Math.hypot(deltaX, deltaY) > 5) {
      hasMoved = true;
      justDragged = true;
      element.classList.add('is-dragging');
      if (handle) handle.classList.add('is-dragging');

      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.left = `${initialLeft}px`;
      element.style.top = `${initialTop}px`;

      if (options.onDragStart) options.onDragStart();
    }

    if (hasMoved) {
      if (e.cancelable) e.preventDefault();

      const elemWidth = element.offsetWidth || 50;
      const elemHeight = element.offsetHeight || 50;
      const maxLeft = Math.max(8, window.innerWidth - elemWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - elemHeight - 8);

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      newLeft = Math.max(8, Math.min(newLeft, maxLeft));
      newTop = Math.max(8, Math.min(newTop, maxTop));

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    element.classList.remove('is-dragging');
    if (handle) handle.classList.remove('is-dragging');

    if (targetHandle.releasePointerCapture) {
      try {
        targetHandle.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    if (!hasMoved) {
      if (options.onClick) options.onClick(e);
    } else {
      setTimeout(() => { justDragged = false; }, 120);
    }
  }

  targetHandle.addEventListener('pointerdown', onPointerDown);

  // Suppress native clicks if a drag operation was completed
  element.addEventListener('click', (e) => {
    if (justDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}
