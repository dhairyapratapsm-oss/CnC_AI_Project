/**
 * CnC Circle - Pro Member Dashboard Engine
 * Features: Material Studio, Dynamic Test Paper & Mock Builder (Board Standards), Mistake Diagnostics, Formula Vault, Syllabus Analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardAuth();
  initThemeToggle(); // Using idempotent global theme toggle from app.js
  initDashboardTabs();
  initMaterialStudio();
  initTestPaperBuilder();
  initMistakeDiagnostics();
  initFormulaVault();
  initAuraAiChat();
});

let currentUser = null;

/* 1. Auth & Session Check + Last Login Formatter */
function initDashboardAuth() {
  try {
    currentUser = JSON.parse(localStorage.getItem('cnc_current_user'));
  } catch (e) {
    currentUser = null;
  }

  if (!currentUser) {
    // Redirect guest to login
    window.location.href = 'register.html?mode=login';
    return;
  }

  // Populate Navbar User Details
  const avatarEl = document.getElementById('dashUserAvatar');
  const nameEl = document.getElementById('dashUserName');
  const roleEl = document.getElementById('dashUserRole');
  const lastLoginEl = document.getElementById('dashLastLoginTime');
  const logoutBtn = document.getElementById('dashLogoutBtn');

  const displayName = currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : 'Member');
  const initials = displayName.substring(0, 2).toUpperCase();

  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = currentUser.role || 'Student';

  // Last Login Timestamp Display
  if (lastLoginEl) {
    const loginTime = currentUser.lastLogin || currentUser.currentLogin || getFormattedCurrentTime();
    lastLoginEl.innerHTML = `Last Login: <strong>${loginTime}</strong>`;
  }

  // Hero Greeting
  const heroNameEl = document.getElementById('dashHeroName');
  const heroRoleBadge = document.getElementById('dashHeroRole');
  const heroClassBadge = document.getElementById('dashHeroClass');
  const heroBoardBadge = document.getElementById('dashHeroBoard');

  if (heroNameEl) heroNameEl.textContent = displayName;
  if (heroRoleBadge) heroRoleBadge.textContent = `${currentUser.role || 'Student'} Workspace`;
  if (heroClassBadge) heroClassBadge.textContent = `Class ${currentUser.targetClass || '12'}`;
  if (heroBoardBadge) heroBoardBadge.textContent = `${currentUser.targetBoard || 'CBSE'} Track`;

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('cnc_current_user');
      window.location.href = 'index.html';
    });
  }
}

function getFormattedCurrentTime() {
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

/* 2. Dashboard Tab Switching */
function initDashboardTabs() {
  const tabBtns = document.querySelectorAll('.dash-tab-item');
  const tabPanels = document.querySelectorAll('.dash-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* 3. Comprehensive Class & Subject Material Generator Studio (Group Box) */
const dashboardMaterialData = {
  physics: {
    "12": {
      "Electric Charges & Fields": {
        cheatSheet: [
          { title: "Coulomb's Law (Electrostatics)", formula: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}", unit: "Newtons (N)", desc: "Electrostatic force between two point charges in vacuum. \\varepsilon_0 = 8.854 \\times 10^{-12} C^2/N\\cdot m^2." },
          { title: "Electric Field Vector", formula: "\\vec{E} = \\lim_{q_0 \\to 0} \\frac{\\vec{F}}{q_0} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\hat{r}", unit: "N/C or V/m", desc: "Force experienced per unit positive test charge placed at distance r." },
          { title: "Electric Dipole & Torque", formula: "\\vec{\\tau} = \\vec{p} \\times \\vec{E} \\implies \\tau = p E \\sin\\theta", unit: "Newton-metre (N·m)", desc: "Torque acting on dipole moment \\vec{p} = q(2\\vec{a}) in uniform electric field \\vec{E}." },
          { title: "Gauss's Law Integral", formula: "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{encl}}}{\\varepsilon_0}", unit: "N·m²/C", desc: "Total electric flux through any closed Gaussian surface equals enclosed charge divided by \\varepsilon_0." }
        ],
        solvedProblems: [
          { q: "Two point charges q₁ = +3 µC and q₂ = -3 µC are separated by 20 cm in air. Calculate the electric field at the midpoint O of the line joining the charges.", level: "Standard Board Exam Problem (3 Marks)", steps: [
            "Step 1: Distance of midpoint O from each charge: r = 20 cm / 2 = 10 cm = 0.1 m.",
            "Step 2: Field due to +3 µC points towards right: E₁ = (9×10⁹ × 3×10⁻⁶) / (0.1)² = 2.7 × 10⁶ N/C.",
            "Step 3: Field due to -3 µC points towards right: E₂ = (9×10⁹ × 3×10⁻⁶) / (0.1)² = 2.7 × 10⁶ N/C.",
            "Step 4: Resultant Field: E_net = E₁ + E₂ = 5.4 × 10⁶ N/C (directed towards negative charge). [Full 3/3 Marks]"
          ]},
          { q: "Derive an expression for the electric field intensity at any point on the axial line of an electric dipole.", level: "HOT Derivation (5 Marks)", steps: [
            "Step 1: Consider dipole length 2a with charges -q and +q. Point P on axis at distance r from dipole center.",
            "Step 2: Field due to +q: E₊ = q / [4πε₀ (r - a)²] (directed along axis outwards).",
            "Step 3: Field due to -q: E₋ = q / [4πε₀ (r + a)²] (directed along axis inwards).",
            "Step 4: Net Field: E = E₊ - E₋ = [q / (4πε₀)] × [4ar / (r² - a²)²]. Since p = 2aq, E = 2p r / [4πε₀ (r² - a²)²].",
            "Step 5: For short dipole (r >> a): E_axial = 2p / (4πε₀ r³). [Board Marking Scheme 5/5 Marks]"
          ]}
        ],
        flashcards: [
          { front: "What is the SI unit and dimensional formula of Electric Flux (Φ)?", back: "SI Unit: N·m²/C or Volt·metre (V·m). Dimensional Formula: [M L³ T⁻³ A⁻¹]." },
          { front: "Why can two electric field lines never intersect each other?", back: "If they intersected, there would be two different tangent vectors at the intersection point, meaning two directions of electric field at a single point, which is physically impossible." },
          { front: "What is the electric flux through a closed surface enclosing an electric dipole?", back: "Zero (0), because the net enclosed charge Q_encl = (+q) + (-q) = 0." }
        ]
      },
      "Current Electricity": {
        cheatSheet: [
          { title: "Ohm's Law & Resistivity", formula: "V = I R, \\quad R = \\rho \\frac{l}{A}", unit: "Ohms (Ω)", desc: "Drift velocity relationship: I = n e A v_d, where v_d = e E \\tau / m." },
          { title: "Kirchhoff's Current & Voltage Laws", formula: "\\sum I = 0, \\quad \\sum \\Delta V = \\sum E - \\sum I R = 0", unit: "Circuit Laws", desc: "KCL is based on conservation of charge; KVL is based on conservation of energy." }
        ],
        solvedProblems: [
          { q: "State Kirchhoff's Rules and derive the balanced Wheatstone bridge condition P/Q = R/S.", level: "Board Derivation (5 Marks)", steps: [
            "Step 1: State Junction Rule (KCL) and Loop Rule (KVL) [1 Mark].",
            "Step 2: Draw Wheatstone bridge circuit diagram with resistors P, Q, R, S and galvanometer G [1 Mark].",
            "Step 3: Apply KVL to Loop ABDA: I₁P + I_g G - I₂R = 0. In balanced condition, I_g = 0 => I₁P = I₂R [1.5 Marks].",
            "Step 4: Apply KVL to Loop BCDB: I₁Q - I₂S - I_g G = 0. In balanced condition => I₁Q = I₂S [1 Mark].",
            "Step 5: Dividing Eq 1 by Eq 2 gives P/Q = R/S [0.5 Mark]. [Total 5/5 Marks]"
          ]}
        ],
        flashcards: [
          { front: "What is the temperature coefficient of resistivity (α) for metals vs semiconductors?", back: "For metals, α is positive (resistance increases with temperature). For semiconductors, α is negative (resistance decreases with temperature)." }
        ]
      }
    },
    "10": {
      "Light - Reflection & Refraction": {
        cheatSheet: [
          { title: "Mirror Formula & Magnification", formula: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad m = -\\frac{v}{u} = \\frac{h'}{h}", unit: "Metres (m)", desc: "Sign conventions: focal length f is positive for convex mirror, negative for concave mirror." },
          { title: "Snell's Law of Refraction", formula: "n_{21} = \\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2}", unit: "Dimensionless", desc: "Ratio of sine of angle of incidence to refraction is constant for a given pair of media." }
        ],
        solvedProblems: [
          { q: "A convex mirror used for rearview on a car has a radius of curvature of 3.00 m. If a bus is located at 5.00 m from this mirror, find the position, nature and size of the image.", level: "Board Problem (3 Marks)", steps: [
            "Step 1: R = +3.00 m => f = +1.50 m. Object distance u = -5.00 m.",
            "Step 2: Mirror formula 1/v = 1/f - 1/u = 1/1.50 - 1/(-5.00) = 1/1.50 + 1/5.00.",
            "Step 3: 1/v = (5.00 + 1.50) / 7.50 = 6.50 / 7.50 => v = +1.15 m (behind mirror, virtual & erect).",
            "Step 4: Magnification m = -v/u = - (1.15) / (-5.00) = +0.23 (diminished). [3/3 Marks]"
          ]}
        ],
        flashcards: [
          { front: "What is Power of a Lens and its SI unit?", back: "Power is the reciprocal of focal length in metres (P = 1/f). SI unit is Dioptre (D)." }
        ]
      }
    }
  },
  chemistry: {
    "12": {
      "Solutions & Colligative Properties": {
        cheatSheet: [
          { title: "Raoult's Law (Relative Lowering)", formula: "\\frac{P^\\circ_A - P_A}{P^\\circ_A} = x_B = \\frac{n_B}{n_A + n_B}", unit: "Dimensionless", desc: "Relative lowering of vapor pressure equals mole fraction of non-volatile solute." },
          { title: "Elevation in Boiling Point", formula: "\\Delta T_b = i \\cdot K_b \\cdot m = i \\cdot K_b \\cdot \\frac{w_B \\times 1000}{M_B \\times w_A}", unit: "Kelvin (K)", desc: "Elevation constant K_b for water is 0.52 K·kg/mol." },
          { title: "Depression in Freezing Point", formula: "\\Delta T_f = i \\cdot K_f \\cdot m", unit: "Kelvin (K)", desc: "Cryoscopic constant K_f for water is 1.86 K·kg/mol." }
        ],
        solvedProblems: [
          { q: "45 g of ethylene glycol (C₂H₆O₂) is mixed with 600 g of water. Calculate: (a) freezing point depression, and (b) freezing point of solution. (Kf for water = 1.86 K kg mol⁻¹)", level: "Board Problem (3 Marks)", steps: [
            "Step 1: Molar mass of C₂H₆O₂ = 62 g/mol. Moles n_B = 45 / 62 = 0.725 mol.",
            "Step 2: Mass of water = 0.600 kg. Molality m = 0.725 / 0.600 = 1.208 mol/kg.",
            "Step 3: ΔT_f = K_f × m = 1.86 × 1.208 = 2.25 K.",
            "Step 4: Freezing point T_f = 273.15 - 2.25 = 270.90 K (-2.25 °C). [3/3 Marks]"
          ]}
        ],
        flashcards: [
          { front: "What is an Ideal Solution?", back: "A solution that obeys Raoult's law at all concentrations and temperatures, where ΔH_mix = 0 and ΔV_mix = 0." }
        ]
      }
    }
  },
  mathematics: {
    "12": {
      "Integrals & Indefinite Integration": {
        cheatSheet: [
          { title: "Integration by Parts", formula: "\\int u v \\, dx = u \\int v dx - \\int (u' \\int v dx) dx", unit: "Analytical", desc: "ILATE prioritization: Inverse, Log, Algebra, Trig, Exponential." },
          { title: "King's Symmetry Property", formula: "\\int_0^a f(x) \\, dx = \\int_0^a f(a - x) \\, dx", unit: "Core Theorem", desc: "Essential for solving trigonometric definite boundary problems." }
        ],
        solvedProblems: [
          { q: "Evaluate: I = \\int_0^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx", level: "Board Question (4 Marks)", steps: [
            "Step 1: Let I = ∫₀^(π/2) [√sin x / (√sin x + √cos x)] dx --- (1)",
            "Step 2: Apply property: replace x by (π/2 - x) => I = ∫₀^(π/2) [√cos x / (√cos x + √sin x)] dx --- (2)",
            "Step 3: Adding (1) and (2) => 2I = ∫₀^(π/2) 1 dx = [x]₀^(π/2) = π/2.",
            "Step 4: I = π/4. [4/4 Marks]"
          ]}
        ],
        flashcards: [
          { front: "What is ∫ 1/(x² + a²) dx?", back: "(1/a) arctan(x/a) + C" }
        ]
      }
    }
  }
};

function initMaterialStudio() {
  const subjSelect = document.getElementById('matSubject');
  const classSelect = document.getElementById('matClass');
  const chapSelect = document.getElementById('matChapter');
  const typePills = document.querySelectorAll('.material-type-pill');
  const generateBtn = document.getElementById('btnGenerateMaterial');
  const viewer = document.getElementById('materialOutputViewer');

  if (!subjSelect || !classSelect || !chapSelect || !viewer) return;

  if (currentUser && currentUser.targetClass && ['9', '10', '11', '12'].includes(currentUser.targetClass.toString())) {
    classSelect.value = currentUser.targetClass.toString();
  }

  function populateChapters() {
    const subj = subjSelect.value;
    const cls = classSelect.value;
    chapSelect.innerHTML = '';

    const chapters = (dashboardMaterialData[subj] && dashboardMaterialData[subj][cls]) 
      ? Object.keys(dashboardMaterialData[subj][cls]) 
      : ["Electric Charges & Fields", "Current Electricity", "Solutions & Colligative Properties", "Integrals & Indefinite Integration"];

    chapters.forEach(chap => {
      const opt = document.createElement('option');
      opt.value = chap;
      opt.textContent = chap;
      chapSelect.appendChild(opt);
    });
  }

  subjSelect.addEventListener('change', populateChapters);
  classSelect.addEventListener('change', populateChapters);
  populateChapters();

  let activeType = 'cheatSheet';
  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeType = pill.dataset.type;
      renderMaterialOutput();
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      renderMaterialOutput();
    });
  }

  function renderMaterialOutput() {
    const subj = subjSelect.value;
    const cls = classSelect.value;
    const chap = chapSelect.value;

    viewer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; color:var(--primary); padding:3rem 0; font-weight:700;">
        <span class="pulse-dot"></span> Synthesizing ${activeType.toUpperCase()} for ${chap} (Class ${cls} ${subj.toUpperCase()})...
      </div>
    `;

    setTimeout(() => {
      const dataObj = (dashboardMaterialData[subj] && dashboardMaterialData[subj][cls] && dashboardMaterialData[subj][cls][chap])
        ? dashboardMaterialData[subj][cls][chap]
        : (dashboardMaterialData.physics["12"]["Electric Charges & Fields"]);

      let innerHtml = '';

      if (activeType === 'cheatSheet') {
        const cards = dataObj.cheatSheet || dashboardMaterialData.physics["12"]["Electric Charges & Fields"].cheatSheet;
        const cardsHtml = cards.map(c => `
          <div class="cheat-card">
            <div class="cheat-card-title">📌 ${c.title}</div>
            <div class="cheat-formula-box">${c.formula}</div>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.4rem;">${c.desc}</p>
            <div style="font-size:0.78rem; font-weight:700; color:var(--secondary);">SI UNIT: ${c.unit}</div>
          </div>
        `).join('');

        innerHtml = `
          <div class="material-header-bar">
            <div>
              <h3 style="font-size:1.35rem; margin-bottom:0.2rem;">📚 ${chap} — Comprehensive Formula & Concept Guide</h3>
              <span style="font-size:0.85rem; color:var(--secondary); font-weight:700;">100% NCERT & Board Grounded • Class ${cls} ${subj.toUpperCase()}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Cheat Sheet</button>
          </div>
          <div class="cheat-sheet-grid">
            ${cardsHtml}
          </div>
        `;
      } else if (activeType === 'solvedProblems') {
        const problems = dataObj.solvedProblems || dashboardMaterialData.physics["12"]["Electric Charges & Fields"].solvedProblems;
        const probsHtml = problems.map((p, idx) => `
          <div class="cheat-card" style="margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="cnc-tag-badge">Problem #${idx + 1}</span>
              <span class="cnc-grounded-tag">${p.level}</span>
            </div>
            <h4 style="font-size:1.05rem; margin-bottom:0.75rem; color:var(--text-main);">${p.q}</h4>
            <div class="solution-steps-box">
              <strong style="font-size:0.85rem; color:var(--accent-purple); display:block; margin-bottom:0.4rem;">OFFICIAL STEP-BY-STEP BOARD SOLUTION:</strong>
              <ol style="padding-left:1.2rem; font-size:0.88rem;">
                ${p.steps.map(s => `<li style="margin-bottom:0.4rem;">${s}</li>`).join('')}
              </ol>
            </div>
          </div>
        `).join('');

        innerHtml = `
          <div class="material-header-bar">
            <div>
              <h3 style="font-size:1.35rem; margin-bottom:0.2rem;">📝 Step-by-Step Solved Board Exam Questions</h3>
              <span style="font-size:0.85rem; color:var(--secondary); font-weight:700;">Includes Official Marks Distribution Rubric</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">📥 Export PDF</button>
          </div>
          <div>${probsHtml}</div>
        `;
      } else if (activeType === 'flashcards') {
        const flashcards = dataObj.flashcards || dashboardMaterialData.physics["12"]["Electric Charges & Fields"].flashcards;
        const flashcardsHtml = flashcards.map((f, i) => `
          <div class="cheat-card" style="cursor:pointer;" onclick="this.querySelector('.flashcard-back').style.display = this.querySelector('.flashcard-back').style.display === 'block' ? 'none' : 'block'">
            <div style="font-size:0.8rem; color:var(--secondary); font-weight:800; margin-bottom:0.4rem;">CARD #${i + 1} (CLICK TO FLIP REVEAL)</div>
            <div style="font-size:1rem; font-weight:700; margin-bottom:0.75rem; color:var(--text-main);">❓ ${f.front}</div>
            <div class="flashcard-back" style="display:none; background:rgba(16, 185, 129, 0.1); border:1px solid var(--accent-green); border-radius:8px; padding:0.75rem; color:var(--text-main); font-size:0.9rem;">
              💡 <strong>Answer:</strong> ${f.back}
            </div>
          </div>
        `).join('');

        innerHtml = `
          <div class="material-header-bar">
            <div>
              <h3 style="font-size:1.35rem; margin-bottom:0.2rem;">⚡ Interactive Rapid Revision Flashcards</h3>
              <span style="font-size:0.85rem; color:var(--secondary); font-weight:700;">Click any card to reveal verified answer</span>
            </div>
          </div>
          <div class="cheat-sheet-grid">${flashcardsHtml}</div>
        `;
      }

      viewer.innerHTML = innerHtml;
    }, 400);
  }

  // Initial render
  renderMaterialOutput();
}

/* 4. Dynamic Board Test Paper & Mock Exam Builder (Standard Questions & Blueprints) */
function initTestPaperBuilder() {
  const titleInput = document.getElementById('testPaperTitle');
  const subjSelect = document.getElementById('testPaperSubject');
  const classSelect = document.getElementById('testPaperClass');
  const durationSelect = document.getElementById('testPaperDuration');
  const marksSelect = document.getElementById('testPaperMarks');
  const chkRubric = document.getElementById('chkIncludeRubric');
  const btnBuild = document.getElementById('btnBuildTestPaper');
  const btnPrint = document.getElementById('btnPrintTestPaper');
  const preview = document.getElementById('testPaperSheetPreview');

  if (!subjSelect || !classSelect || !btnBuild || !preview) return;

  // Pre-fill user target class if enrolled
  if (currentUser && currentUser.targetClass && ['9', '10', '11', '12'].includes(currentUser.targetClass.toString())) {
    classSelect.value = currentUser.targetClass.toString();
  }

  // 1. Dynamic Test Title Generator
  function updateDynamicTestTitle() {
    if (!titleInput) return;
    const subj = subjSelect.value;
    const cls = classSelect.value;
    const marks = marksSelect.value;

    let examType = 'All-India Pre-Board Standard Examination';
    if (marks === '25') examType = 'Chapter Milestone Assessment & Diagnostic Test';
    else if (marks === '40') examType = 'Term-1 Mid-Term Board Practice Paper';
    else if (marks === '80') examType = 'Annual Board Standard Examination';

    titleInput.value = `Class ${cls} ${subj} — ${examType} (${marks} Marks)`;
  }

  subjSelect.addEventListener('change', updateDynamicTestTitle);
  classSelect.addEventListener('change', updateDynamicTestTitle);
  marksSelect.addEventListener('change', updateDynamicTestTitle);
  durationSelect.addEventListener('change', updateDynamicTestTitle);
  updateDynamicTestTitle();

  // 2. Full-Length Standard Board Question Blueprint Database
  const boardQuestionBanks = {
    Physics: {
      secA: [
        { q: "An electric dipole of dipole moment p is placed in a uniform electric field E. The torque experienced by it is maximum when the angle between p and E is:", opt: ["(a) 0°", "(b) 45°", "(c) 90°", "(d) 180°"], rubric: "Correct: (c) 90°. Formula: τ = pE sin θ. Maximum torque τ_max = pE at θ = 90° [1 Mark]." },
        { q: "Two copper spheres of same radii, one hollow and other solid, are charged to the same potential. Which will hold more charge?", opt: ["(a) Solid sphere", "(b) Hollow sphere", "(c) Both will hold equal charge", "(d) Cannot be determined"], rubric: "Correct: (c) Equal charge. Potential V = q / (4πε₀R) depends only on radius R [1 Mark]." },
        { q: "The electric flux through a closed Gaussian surface enclosing an electric dipole of moment p is:", opt: ["(a) p / ε₀", "(b) 2p / ε₀", "(c) Zero", "(d) 2q / ε₀"], rubric: "Correct: (c) Zero. Net enclosed charge Q_encl = (+q) + (-q) = 0 => Φ = Q_encl / ε₀ = 0 [1 Mark]." },
        { q: "A wire of resistance R is stretched to double its original length. Its new resistance becomes:", opt: ["(a) 2R", "(b) 4R", "(c) R/2", "(d) R/4"], rubric: "Correct: (b) 4R. Volume is constant: A' = A/2, l' = 2l => R' = ρ(2l)/(A/2) = 4R [1 Mark]." },
        { q: "Assertion (A): Electric field lines never cross each other.<br>Reason (R): If they cross, there would be two directions of electric field at the intersection point.", opt: ["(a) Both A and R are true and R is the correct explanation of A", "(b) Both A and R are true but R is NOT the correct explanation", "(c) A is true but R is false", "(d) A is false but R is true"], rubric: "Correct: (a) Both A and R are true and R correctly explains A [1 Mark]." },
        { q: "A parallel plate capacitor is charged and then disconnected from battery. If distance d between plates is doubled, the stored energy:", opt: ["(a) Halves", "(b) Doubles", "(c) Remains same", "(d) Becomes 4 times"], rubric: "Correct: (b) Doubles. Q is constant: U = Q² / (2C). Since C = ε₀A/d halves, U doubles [1 Mark]." },
        { q: "The SI unit of magnetic dipole moment is:", opt: ["(a) Ampere-metre (A·m)", "(b) Ampere-metre² (A·m²)", "(c) Tesla-metre (T·m)", "(d) Weber (Wb)"], rubric: "Correct: (b) A·m². M = I × A = Ampere × metre² [1 Mark]." },
        { q: "Which of the following electromagnetic waves has the highest frequency?", opt: ["(a) Microwaves", "(b) Infrared waves", "(c) Gamma rays", "(d) Ultraviolet rays"], rubric: "Correct: (c) Gamma rays. (f ≈ 10²⁰ to 10²⁴ Hz) [1 Mark]." },
        { q: "A ray of light enters from air into glass of refractive index 1.5. The speed of light in glass is:", opt: ["(a) 3.0 × 10⁸ m/s", "(b) 2.0 × 10⁸ m/s", "(c) 1.5 × 10⁸ m/s", "(d) 4.5 × 10⁸ m/s"], rubric: "Correct: (b) 2.0 × 10⁸ m/s. v = c/n = (3×10⁸)/1.5 = 2.0 × 10⁸ m/s [1 Mark]." },
        { q: "In Young's double slit experiment, if the distance between slits is halved and screen distance is doubled, the fringe width becomes:", opt: ["(a) 2 times", "(b) 4 times", "(c) Half", "(d) Unchanged"], rubric: "Correct: (b) 4 times. β = λD/d => β' = λ(2D)/(d/2) = 4β [1 Mark]." },
        { q: "Assertion (A): Photoelectric effect demonstrates particle nature of light.<br>Reason (R): Instantaneous emission of electrons occurs without time lag when frequency ν > ν₀.", opt: ["(a) Both A and R are true and R is correct explanation of A", "(b) Both A and R are true but R is not correct explanation", "(c) A is true but R is false", "(d) A is false but R is true"], rubric: "Correct: (a) Both A and R are true and R is correct explanation [1 Mark]." },
        { q: "The de Broglie wavelength associated with an electron accelerated through potential difference V is:", opt: ["(a) 1.227 / √V nm", "(b) 0.1227 / √V nm", "(c) 12.27 / √V nm", "(d) √V / 1.227 nm"], rubric: "Correct: (a) 1.227 / √V nm [1 Mark]." },
        { q: "Nuclear density is of the order of:", opt: ["(a) 10³ kg/m³", "(b) 10¹⁰ kg/m³", "(c) 10¹⁷ kg/m³", "(d) 10²⁵ kg/m³"], rubric: "Correct: (c) 10¹⁷ kg/m³ (constant for all nuclei, independent of mass number A) [1 Mark]." },
        { q: "In an unbiased p-n junction, hole diffusion from p to n region is caused by:", opt: ["(a) Electric field in depletion layer", "(b) Concentration gradient of holes", "(c) Thermal agitation", "(d) Potential barrier"], rubric: "Correct: (b) Concentration gradient of holes [1 Mark]." },
        { q: "The work function of Caesium is 2.14 eV. The threshold frequency for Caesium is:", opt: ["(a) 5.16 × 10¹⁴ Hz", "(b) 6.25 × 10¹⁴ Hz", "(c) 4.28 × 10¹⁴ Hz", "(d) 3.14 × 10¹⁴ Hz"], rubric: "Correct: (a) 5.16 × 10¹⁴ Hz. ν₀ = Φ₀/h = (2.14 × 1.6×10⁻¹⁹) / (6.63×10⁻³⁴) = 5.16×10¹⁴ Hz [1 Mark]." },
        { q: "The angle of dip at the magnetic equator of Earth is:", opt: ["(a) 0°", "(b) 45°", "(c) 90°", "(d) 180°"], rubric: "Correct: (a) 0°. Magnetic field lines are parallel to Earth's surface at the magnetic equator [1 Mark]." }
      ],
      secB: [
        { q: "Derive the relation between electric current I and drift velocity v_d of electrons in a conductor.", rubric: "Consider conductor length l, cross-section A, free electron density n. Total charge Q = n e A l [1 Mark]. Current I = Q/t = n e A l / (l/v_d) = n e A v_d [1 Mark]." },
        { q: "Explain with a ray diagram why diamond sparkles brilliantly.", rubric: "Diagram showing multiple total internal reflections [1 Mark]. High refractive index (n=2.42) gives very small critical angle (i_c = 24.4°). Light entering faces strikes at i > i_c, suffering multiple TIRs before emerging [1 Mark]." },
        { q: "Draw energy band diagrams of: (i) an n-type semiconductor, and (ii) a p-type semiconductor at T > 0 K.", rubric: "n-type diagram showing donor energy level E_d just below conduction band E_c [1 Mark]. p-type diagram showing acceptor energy level E_a just above valence band E_v [1 Mark]." },
        { q: "Two circular coils of radii r₁ = 20 cm and r₂ = 2 cm are concentric and coplanar. Calculate their mutual inductance M.", rubric: "Formula M = μ₀ π r₂² / (2 r₁) [1 Mark]. Substitution: M = (4π×10⁻⁷ × π × 0.02²) / (2 × 0.20) = 3.95 × 10⁻⁹ H [1 Mark]." },
        { q: "State Lenz's Law and show that it is a consequence of the law of conservation of energy.", rubric: "Statement: Polarity of induced emf opposes the change in magnetic flux producing it [1 Mark]. Mechanical work done in moving magnet against repulsive/attractive magnetic force is transformed into electrical energy [1 Mark]." }
      ],
      secC: [
        { q: "State Gauss's Law in electrostatics. Use it to derive the electric field due to a uniformly charged thin spherical shell at: (a) a point outside the shell, and (b) a point inside the shell.", rubric: "Gauss's law statement: ∮ E·dA = q/ε₀ [1 Mark]. (a) Outside point: Gaussian sphere radius r > R => E·4πr² = q/ε₀ => E = q / (4πε₀r²) [1 Mark]. (b) Inside point: Enclosed charge q = 0 => E·4πr² = 0 => E_inside = 0 [1 Mark]." },
        { q: "A sinusoidal voltage V = 200 sin(100πt) is applied across a series LCR circuit with R = 10 Ω, L = 28.6 mH, and C = 100 µF. Find: (i) Impedance Z, (ii) Phase angle φ, (iii) Resonant frequency f₀.", rubric: "(i) X_L = ωL = 100π×0.0286 = 9.0 Ω, X_C = 1/(ωC) = 1/(100π×100×10⁻⁶) = 31.8 Ω. Z = √[R² + (X_L - X_C)²] = √[100 + (-22.8)²] = 24.9 Ω [1 Mark]. (ii) tan φ = (X_L - X_C)/R = -2.28 => φ = -66.3° (current leads) [1 Mark]. (iii) f₀ = 1 / [2π√(LC)] = 94.1 Hz [1 Mark]." },
        { q: "Derive Lens Maker's Formula for a thin double convex lens of refractive index n placed in a medium of refractive index 1.", rubric: "Refraction at 1st surface: n/v₁ - 1/u = (n-1)/R₁ [1 Mark]. Refraction at 2nd surface: 1/v - n/v₁ = (1-n)/R₂ [1 Mark]. Adding equations: 1/v - 1/u = (n-1)[1/R₁ - 1/R₂]. Since 1/v - 1/u = 1/f => 1/f = (n-1)[1/R₁ - 1/R₂] [1 Mark]." },
        { q: "Using Bohr's postulates, derive the expression for the radius of the n-th stationary orbit of hydrogen atom. Hence show that r_n ∝ n².", rubric: "Electrostatic force = Centripetal force: (1/4πε₀) e²/r² = m v²/r => v² = e² / (4πε₀ m r) [1 Mark]. Bohr's quantization: m v r = n h / (2π) => v = n h / (2π m r) [1 Mark]. Equating: r_n = (ε₀ h² n²) / (π m e²). Hence r_n ∝ n² [1 Mark]." },
        { q: "Draw the circuit diagram of a full-wave rectifier using two junction diodes. Explain its working principle with input and output waveforms.", rubric: "Circuit diagram with center-tapped transformer, 2 diodes D₁ & D₂, and load R_L [1 Mark]. Working during positive and negative half-cycles [1 Mark]. Labeled input AC and rectified output DC waveforms [1 Mark]." },
        { q: "Define mutual inductance and self-inductance. Derive the self-inductance L of a long solenoid of length l, area A, and total turns N.", rubric: "Definitions with SI unit Henry [1 Mark]. Solenoid field B = μ₀ (N/l) I [1 Mark]. Total flux NΦ = N B A = μ₀ (N²/l) A I => L = μ₀ N² A / l [1 Mark]." },
        { q: "State Huygens' Principle. Use it to verify Snell's Law of refraction at a plane boundary separating two media.", rubric: "Statement of wavelets and secondary wavefront [1 Mark]. Labeled diagram showing incident and refracted wavefronts AB & CD [1 Mark]. In triangles: sin i = v₁t/AC, sin r = v₂t/AC => sin i / sin r = v₁/v₂ = n₂₁ (Snell's Law) [1 Mark]." }
      ],
      secD: [
        { q: "CASE STUDY 1: PHOTOELECTRIC EXPERIMENT<br>In 1905, Albert Einstein proposed that electromagnetic radiation consists of discrete energy packets called photons, each of energy E = hν. When light shines on a metallic surface, electrons absorb energy and are emitted instantly without time lag if hν > Φ₀.<br><strong>Questions:</strong><br>(i) Why is photoelectric emission instantaneous according to photon theory? [1 Mark]<br>(ii) How does stopping potential V₀ vary with intensity of incident radiation? [1 Mark]<br>(iii) Monochromatic light of frequency 8.0 × 10¹⁴ Hz falls on a metal surface of work function 2.0 eV. Calculate the maximum kinetic energy of emitted photoelectrons in Joules. [2 Marks]", rubric: "(i) One photon collides directly with one electron and transfers its complete energy instantaneously [1 Mark]. (ii) Stopping potential is independent of intensity [1 Mark]. (iii) E = hν = (6.63×10⁻³⁴)(8.0×10¹⁴) = 5.30×10⁻¹⁹ J. Φ₀ = 2.0 × 1.6×10⁻¹⁹ = 3.20×10⁻¹⁹ J. K_max = E - Φ₀ = 2.10 × 10⁻¹⁹ J [2 Marks]." },
        { q: "CASE STUDY 2: ELECTRICAL TRANSMISSION & TRANSFORMERS<br>Large amounts of electrical power generated at power stations are transmitted over long distances through high-voltage cables to minimize I²R transmission line power losses. Step-up transformers increase voltage at generation plant, while step-down transformers lower voltage at local sub-stations for domestic consumption.<br><strong>Questions:</strong><br>(i) State the working principle of a transformer. [1 Mark]<br>(ii) Why can a transformer NOT work on direct current (DC)? [1 Mark]<br>(iii) A step-down transformer converts 2200 V to 220 V. If the secondary coil delivers a current of 10 A at 90% efficiency, calculate the input current drawn from the primary line. [2 Marks]", rubric: "(i) Mutual induction: Changing AC flux in primary induces emf in secondary [1 Mark]. (ii) DC creates constant magnetic flux (dΦ/dt = 0), so induced emf is zero [1 Mark]. (iii) Output Power = V_s I_s = 220 × 10 = 2200 W. Input Power = 2200 / 0.90 = 2444.4 W. I_p = P_in / V_p = 2444.4 / 2200 = 1.11 A [2 Marks]." }
      ],
      secE: [
        { q: "(a) Derive the expression for electric potential V at any point (r, θ) due to a short electric dipole of dipole moment p.<br>(b) Two point charges +4 µC and -2 µC are separated by a distance of 1 m in air. Find the point on the line joining them at which the net electrostatic potential is zero.<br><strong>[OR]</strong><br>(a) Derive an expression for the capacitance of a parallel plate capacitor with a dielectric slab of thickness t (t < d) introduced between the plates.<br>(b) A 600 pF capacitor is charged by a 200 V supply. It is then disconnected and connected to an uncharged 600 pF capacitor. Calculate the electrostatic energy lost in this process.", rubric: "(a) Dipole potential V = [1/(4πε₀)] [p cos θ / r²] with complete derivation [3 Marks]. (b) Let point be at distance x from +4 µC: 4×10⁻⁶ / x = 2×10⁻⁶ / (1 - x) => 4(1-x) = 2x => 6x = 4 => x = 0.67 m [2 Marks]. [OR: Capacitance C = ε₀A / (d - t + t/K) derivation [3 Marks]. Energy lost = (1/4) C V² = 6.0 × 10⁻⁶ J [2 Marks]]. [Total 5 Marks]" },
        { q: "(a) State Biot-Savart Law. Use it to derive the magnetic field on the axis of a circular current-carrying loop of radius R at distance x from its center.<br>(b) A circular coil of 100 turns and radius 8 cm carries a current of 0.40 A. What is the magnetic field at the center of the coil?<br><strong>[OR]</strong><br>(a) State the principle and working of a Moving Coil Galvanometer. Derive the relationship between deflection θ and current I.<br>(b) How can a galvanometer of resistance G and full scale deflection current I_g be converted into an ammeter of range 0 to I?", rubric: "(a) Biot-Savart law statement and derivation: B = μ₀ I R² / [2(R² + x²)^(3/2)] [3 Marks]. (b) B_center = μ₀ N I / (2R) = (4π×10⁻⁷ × 100 × 0.40) / (2 × 0.08) = 3.14 × 10⁻⁴ T [2 Marks]. [OR: Galvanometer τ = N I A B = C θ => I = (C / NAB) θ derivation [3 Marks]. Ammeter shunt formula S = (I_g G) / (I - I_g) [2 Marks]]. [Total 5 Marks]" },
        { q: "(a) Derive the prism formula connecting refractive index n, angle of prism A, and angle of minimum deviation D_m.<br>(b) Draw a labeled ray diagram of an Astronomical Telescope in normal adjustment. Derive the expression for its magnifying power m.<br><strong>[OR]</strong><br>(a) Explain the phenomenon of diffraction of light at a single slit of width 'a'. Obtain the conditions for central maximum and secondary minima.<br>(b) What is the width of central maximum in terms of slit width a, wavelength λ, and distance D?", rubric: "(a) Prism derivation: i = (A + D_m)/2, r = A/2 => n = sin[(A+D_m)/2] / sin(A/2) [3 Marks]. (b) Ray diagram and magnification m = - f_o / f_e [2 Marks]. [OR: Single slit path difference a sin θ = nλ derivation [3 Marks]. Central maximum angular width 2θ = 2λ/a, linear width β₀ = 2λD/a [2 Marks]]. [Total 5 Marks]" }
      ]
    },
    Chemistry: {
      secA: [
        { q: "Which of the following colligative properties is most suitable for determining the molar mass of polymers and proteins?", opt: ["(a) Relative lowering of vapor pressure", "(b) Elevation in boiling point", "(c) Depression in freezing point", "(d) Osmotic pressure"], rubric: "Correct: (d) Osmotic pressure. Measured at room temperature with measurable magnitudes even for dilute macromolecular solutions [1 Mark]." },
        { q: "The value of Henry's constant K_H increases with:", opt: ["(a) Increase in temperature", "(b) Decrease in temperature", "(c) Increase in pressure", "(d) Remains constant"], rubric: "Correct: (a) Increase in temperature (leading to lower gas solubility) [1 Mark]." },
        { q: "The SI unit of molar conductivity (Λ_m) is:", opt: ["(a) S cm⁻¹", "(b) S cm² mol⁻¹", "(c) S⁻¹ cm² mol⁻¹", "(d) Ω cm² mol⁻¹"], rubric: "Correct: (b) S cm² mol⁻¹ (or S m² mol⁻¹) [1 Mark]." },
        { q: "For a first-order chemical reaction, the unit of rate constant k is:", opt: ["(a) mol L⁻¹ s⁻¹", "(b) L mol⁻¹ s⁻¹", "(c) s⁻¹", "(d) mol⁻² L² s⁻¹"], rubric: "Correct: (c) s⁻¹ [1 Mark]." },
        { q: "Which of the following transition metals exhibits the highest oxidation state (+7)?", opt: ["(a) Chromium (Cr)", "(b) Manganese (Mn)", "(c) Iron (Fe)", "(d) Vanadium (V)"], rubric: "Correct: (b) Manganese (Mn in KMnO₄ exhibits +7) [1 Mark]." },
        { q: "The IUPAC name of [Co(NH₃)₅(CO₃)]Cl is:", opt: ["(a) Pentaamminecarbonatocobalt(III) chloride", "(b) Carbonatopentaamminecobalt(II) chloride", "(c) Pentaamminechlorocobalt(III) carbonate", "(d) Carbonatopentaamminecobalt(III) chloride"], rubric: "Correct: (a) Pentaamminecarbonatocobalt(III) chloride [1 Mark]." },
        { q: "Haloalkanes undergo nucleophilic substitution via S_N2 mechanism with:", opt: ["(a) Retention of configuration", "(b) Inversion of configuration", "(c) Racemization", "(d) No change"], rubric: "Correct: (b) Inversion of configuration (Walden inversion) [1 Mark]." },
        { q: "Lucas reagent is an equimolar mixture of:", opt: ["(a) Conc. HCl + Anhydrous ZnCl₂", "(b) Conc. HNO₃ + ZnSO₄", "(c) Dilute HCl + ZnCl₂", "(d) Conc. H₂SO₄ + ZnCl₂"], rubric: "Correct: (a) Conc. HCl + Anhydrous ZnCl₂ [1 Mark]." },
        { q: "Phenol on distillation with Zinc dust gives:", opt: ["(a) Toluene", "(b) Benzene", "(c) Benzaldehyde", "(d) Benzoic acid"], rubric: "Correct: (b) Benzene: C₆H₅OH + Zn -> C₆H₆ + ZnO [1 Mark]." },
        { q: "Which of the following compounds gives a positive Iodoform test (yellow precipitate of CHI₃)?", opt: ["(a) Methanol", "(b) Ethanol", "(c) Propan-1-ol", "(d) Benzaldehyde"], rubric: "Correct: (b) Ethanol (contains CH₃-CH(OH)- group) [1 Mark]." },
        { q: "Cannizzaro reaction is NOT given by:", opt: ["(a) Formaldehyde (HCHO)", "(b) Benzaldehyde (C₆H₅CHO)", "(c) Acetaldehyde (CH₃CHO)", "(d) Trimethylacetaldehyde"], rubric: "Correct: (c) Acetaldehyde (has α-hydrogens, undergoes aldol condensation) [1 Mark]." },
        { q: "Carbylamine test is given only by:", opt: ["(a) Primary amines (R-NH₂)", "(b) Secondary amines (R₂NH)", "(c) Tertiary amines (R₃N)", "(d) Quaternary ammonium salts"], rubric: "Correct: (a) Primary amines (aliphatic and aromatic) [1 Mark]." },
        { q: "Which vitamin is water-soluble?", opt: ["(a) Vitamin A", "(b) Vitamin D", "(c) Vitamin C", "(d) Vitamin K"], rubric: "Correct: (c) Vitamin C (and Vitamin B-complex) [1 Mark]." },
        { q: "In DNA, the complementary base pair of Adenine (A) is:", opt: ["(a) Guanine (G)", "(b) Thymine (T)", "(c) Cytosine (C)", "(d) Uracil (U)"], rubric: "Correct: (b) Thymine (T) via 2 hydrogen bonds [1 Mark]." },
        { q: "Assertion (A): Boiling points of alkyl halides are higher than those of corresponding parent hydrocarbons.<br>Reason (R): Dipole-dipole and stronger van der Waals attractions operate in polar alkyl halides.", opt: ["(a) Both A and R are true and R is correct explanation of A", "(b) Both A and R are true but R is not correct explanation", "(c) A is true but R is false", "(d) A is false but R is true"], rubric: "Correct: (a) Both A and R are true and R correctly explains A [1 Mark]." },
        { q: "The magnetic moment of [Fe(CN)₆]³⁻ is 1.73 BM, indicating the number of unpaired electrons is:", opt: ["(a) 1", "(b) 2", "(c) 3", "(d) 5"], rubric: "Correct: (a) 1. μ = √[n(n+2)] = √[1(3)] = √3 = 1.73 BM [1 Mark]." }
      ],
      secB: [
        { q: "State Kohlrausch's Law of independent migration of ions. Write its application in calculating Λ°_m of a weak electrolyte like acetic acid (CH₃COOH).", rubric: "Statement: Limiting molar conductivity of an electrolyte equals sum of individual contributions of cations and anions [1 Mark]. Application: Λ°_m(CH₃COOH) = Λ°_m(CH₃COONa) + Λ°_m(HCl) - Λ°_m(NaCl) [1 Mark]." },
        { q: "Show that for a first-order reaction, the time required for 99.9% completion is approximately 10 times the half-life (t_1/2).", rubric: "t = (2.303/k) log [100 / (100 - 99.9)] = (2.303/k) log 10³ = (2.303×3)/k = 6.909/k [1 Mark]. t_1/2 = 0.693/k => t_99.9% / t_1/2 = 6.909 / 0.693 ≈ 10 [1 Mark]." },
        { q: "Explain why transition metals and their compounds act as excellent catalysts.", rubric: "Reason 1: Variable oxidation states allowing formation of unstable intermediate complexes [1 Mark]. Reason 2: Large surface area with vacant d-orbitals to adsorb reactant molecules [1 Mark]." },
        { q: "Write chemical equations for: (i) Reimer-Tiemann reaction, and (ii) Williamson ether synthesis.", rubric: "(i) Phenol + CHCl₃ + 3NaOH (340 K) -> Salicylaldehyde + 3NaCl + 2H₂O [1 Mark]. (ii) R-X + R'-ONa -> R-O-R' + NaX [1 Mark]." },
        { q: "Define Peptide Linkage and Denaturation of Proteins.", rubric: "Peptide linkage: Amide -CO-NH- bond formed between -COOH of one amino acid and -NH₂ of another with loss of H₂O [1 Mark]. Denaturation: Loss of biological activity and disruption of secondary/tertiary structures due to temperature/pH without affecting primary peptide sequence [1 Mark]." }
      ],
      secC: [
        { q: "A galvanic cell consists of Mg(s) | Mg²⁺(0.1 M) || Cu²⁺(1×10⁻³ M) | Cu(s). Given E°(Mg²⁺/Mg) = -2.37 V and E°(Cu²⁺/Cu) = +0.34 V at 298 K. Calculate the EMF of the cell.", rubric: "E°_cell = E°_cathode - E°_anode = +0.34 - (-2.37) = +2.71 V [1 Mark]. Nernst Eq: E_cell = E°_cell - (0.0591/n) log [Mg²⁺]/[Cu²⁺] [1 Mark]. E_cell = 2.71 - (0.0591/2) log [0.1 / 10⁻³] = 2.71 - 0.02955 log(10²) = 2.71 - 0.0591 = 2.65 V [1 Mark]." },
        { q: "The rate constants of a reaction at 500 K and 700 K are 0.02 s⁻¹ and 0.07 s⁻¹ respectively. Calculate the activation energy (E_a) of the reaction. (R = 8.314 J K⁻¹ mol⁻¹)", rubric: "Formula: log(k₂/k₁) = (E_a / 2.303 R) × [(T₂ - T₁) / (T₁ T₂)] [1 Mark]. log(0.07 / 0.02) = log(3.5) = 0.544 = [E_a / (2.303 × 8.314)] × [200 / 350000] [1 Mark]. E_a = (0.544 × 19.147 × 350000) / 200 = 18.23 kJ/mol [1 Mark]." },
        { q: "Give reasons for the following:<br>(a) Transition metals form colored complexes.<br>(b) Zr (atomic no 40) and Hf (atomic no 72) have almost identical atomic and ionic radii.<br>(c) Actinoid contraction is greater from element to element than lanthanoid contraction.", rubric: "(a) d-d electronic transitions in presence of crystal field splitting [1 Mark]. (b) Lanthanoid contraction due to poor shielding by 14 4f electrons [1 Mark]. (c) Poorer shielding effect of 5f electrons compared to 4f electrons [1 Mark]." },
        { q: "Using Crystal Field Theory (CFT), explain the hybridization, magnetic behavior, and geometry of: (i) [Co(NH₃)₆]³⁺ (diamagnetic), and (ii) [CoF₆]³⁻ (paramagnetic).", rubric: "(i) [Co(NH₃)₆]³⁺: Co³⁺ is d⁶. Strong field ligand NH₃ causes pairing => t_2g⁶ e_g⁰ => d²sp³ inner orbital complex, octahedral, diamagnetic (0 unpaired electrons) [1.5 Marks]. (ii) [CoF₆]³⁻: Weak field ligand F⁻ => t_2g⁴ e_g² => sp³d² outer orbital complex, octahedral, paramagnetic (4 unpaired electrons) [1.5 Marks]." },
        { q: "An organic compound (A) with molecular formula C₈H₈O gives positive 2,4-DNP and Iodoform tests. It does NOT reduce Tollens' or Fehling's reagent. On oxidation with hot KMnO₄, it gives benzoic acid. Identify (A) and write all chemical reactions involved.", rubric: "Deduction: (A) is Acetophenone (C₆H₅COCH₃) [1 Mark]. 2,4-DNP gives 2,4-dinitrophenylhydrazone; Iodoform gives CHI₃ (yellow ppt) + C₆H₅COONa [1 Mark]. Oxidation: C₆H₅COCH₃ + [O] -> C₆H₅COOH [1 Mark]." },
        { q: "How will you bring about the following conversions (not more than 2 steps)?<br>(a) Aniline to Bromobenzene<br>(b) Nitrobenzene to Benzoic acid<br>(c) Ethanamine to Methanamine", rubric: "(a) Aniline + NaNO₂ + HCl (0-5°C) -> Diazonium salt + CuBr/HBr (Sandmeyer) -> Bromobenzene [1 Mark]. (b) Nitrobenzene + Sn/HCl -> Aniline -> Diazonium salt + CuCN -> Benzonitrile + H₃O⁺ -> Benzoic acid [1 Mark]. (c) CH₃CH₂NH₂ + HNO₂ -> CH₃CH₂OH + [O] -> CH₃COOH + NH₃/heat -> CH₃CONH₂ + Br₂/KOH (Hoffmann bromamide) -> CH₃NH₂ [1 Mark]." },
        { q: "Explain the mechanism of acid-catalyzed dehydration of ethanol to yield ethene at 443 K.", rubric: "Step 1: Protonation of alcohol: CH₃CH₂OH + H⁺ <=> CH₃CH₂-OH₂⁺ [1 Mark]. Step 2: Formation of carbocation (slow step): CH₃CH₂-OH₂⁺ -> CH₃-CH₂⁺ + H₂O [1 Mark]. Step 3: Elimination of proton: CH₃-CH₂⁺ -> CH₂=CH₂ + H⁺ [1 Mark]." }
      ],
      secD: [
        { q: "CASE STUDY 1: ELECTROCHEMICAL CELLS & BATTERIES<br>Lead storage batteries and modern Lithium-ion batteries store electrical energy by driving reversible redox reactions. In secondary batteries, electrical energy is supplied from an external source to recharge the cell, restoring active electrode materials.<br><strong>Questions:</strong><br>(i) Write the overall cell reaction during the discharging of a Lead Storage battery. [1 Mark]<br>(ii) What happens to the density and concentration of H₂SO₄ electrolyte during battery recharging? [1 Mark]<br>(iii) If a current of 2.0 A is passed through a solution of CuSO₄ for 30 minutes, calculate the mass of copper deposited at the cathode. (Molar mass of Cu = 63.5 g/mol, 1 F = 96500 C) [2 Marks]", rubric: "(i) Pb(s) + PbO₂(s) + 2H₂SO₄(aq) -> 2PbSO₄(s) + 2H₂O(l) [1 Mark]. (ii) Concentration and density of H₂SO₄ increase back to ~1.30 g/cm³ [1 Mark]. (iii) Q = I × t = 2.0 × (30 × 60) = 3600 C. Cu²⁺ + 2e⁻ -> Cu (2 F deposits 63.5 g). Mass m = (63.5 × 3600) / (2 × 96500) = 1.184 g [2 Marks]." },
        { q: "CASE STUDY 2: KINETICS & ARRHENIUS ACTIVATION ENERGY<br>Chemical reactions occur when reacting molecules possess kinetic energy exceeding a threshold value (E_activation). The temperature dependence of reaction rate constant is given by the Arrhenius equation k = A exp(-E_a / RT).<br><strong>Questions:</strong><br>(i) Define threshold energy of a chemical reaction. [1 Mark]<br>(ii) What is the effect of adding a positive catalyst on the activation energy (E_a) and enthalpy change (ΔH) of a reaction? [1 Mark]<br>(iii) The rate of a chemical reaction quadruples when temperature changes from 293 K to 313 K. Calculate the activation energy (E_a) of the reaction. (R = 8.314 J/K·mol) [2 Marks]", rubric: "(i) Threshold energy: Minimum energy colliding molecules must possess for collision to result in chemical reaction [1 Mark]. (ii) Catalyst lowers activation energy E_a, but has NO effect on ΔH of reaction [1 Mark]. (iii) log(k₂/k₁) = log 4 = 0.602 = [E_a / (2.303×8.314)] × [20 / (293×313)] => E_a = (0.602 × 19.147 × 91709) / 20 = 52.86 kJ/mol [2 Marks]." }
      ],
      secE: [
        { q: "(a) What are ideal and non-ideal solutions? Explain positive and negative deviations from Raoult's law with 1 example each and vapor pressure curves.<br>(b) Calculate the boiling point of a solution containing 15 g of glucose (C₆H₁₂O₆) dissolved in 250 g of water. (K_b for water = 0.52 K kg mol⁻¹)<br><strong>[OR]</strong><br>(a) State Henry's law and write 2 important industrial/biological applications.<br>(b) Define van 't Hoff factor (i). A 0.2 molal aqueous solution of KCl freezes at -0.680 °C. Calculate the percentage degree of dissociation of KCl. (K_f for water = 1.86 K kg mol⁻¹)", rubric: "(a) Ideal: obeys Raoult's law at all conc (ΔH=0, ΔV=0). Positive dev: ethanol+acetone (A-B interactions weaker than A-A). Negative dev: chloroform+acetone (A-B stronger due to H-bonding) [3 Marks]. (b) Molality m = (15/180) / 0.250 = 0.333 mol/kg. ΔT_b = 0.52 × 0.333 = 0.173 K => B.P. = 100 + 0.173 = 100.173 °C [2 Marks]. [OR: Henry's law and applications [2.5 Marks]. i = ΔT_f(obs)/(K_f×m) = 0.680/(1.86×0.2) = 1.828. α = (i-1)/(n-1) = 0.828 => 82.8% dissociation [2.5 Marks]]. [Total 5 Marks]" },
        { q: "(a) Write the chemical equations and mechanisms for Aldol Condensation and Cannizzaro Reaction.<br>(b) An aliphatic aldehyde (A) gives positive Fehling's test. When treated with HCN followed by hydrolysis, it forms 2-hydroxypropanoic acid (lactic acid). Identify (A).<br><strong>[OR]</strong><br>(a) Describe the chemical tests to distinguish between:<br>&nbsp;&nbsp;&nbsp;&nbsp;(i) Propanal and Propanone<br>&nbsp;&nbsp;&nbsp;&nbsp;(ii) Benzaldehyde and Benzoic acid<br>&nbsp;&nbsp;&nbsp;&nbsp;(iii) Phenol and Benzoic acid<br>(b) Arrange the following in increasing order of acid strength: CH₃COOH, HCOOH, ClCH₂COOH, FCH₂COOH, C₆H₅COOH.", rubric: "(a) Aldol mechanism: enolate ion formation, nucleophilic attack on carbonyl carbon, dehydration [2.5 Marks]. Cannizzaro: hydride transfer mechanism [1.5 Marks]. (b) Acetaldehyde (CH₃CHO) gives lactic acid CH₃CH(OH)COOH [1 Mark]. [OR: (i) Tollens/Fehling test, (ii) NaHCO₃ effervescence, (iii) Neutral FeCl₃ test [3 Marks]. (b) CH₃COOH < C₆H₅COOH < HCOOH < ClCH₂COOH < FCH₂COOH [2 Marks]]. [Total 5 Marks]" },
        { q: "(a) Write the anode, cathode, and overall reactions for a Hydrogen-Oxygen Fuel Cell. What are its two advantages over conventional thermal plants?<br>(b) The conductivity of 0.001028 mol L⁻¹ acetic acid is 4.95 × 10⁻⁵ S cm⁻¹. Calculate its dissociation constant K_a if Λ°_m(CH₃COOH) = 390.5 S cm² mol⁻¹.<br><strong>[OR]</strong><br>(a) State Faraday's First and Second Laws of Electrolysis.<br>(b) Calculate the standard Gibbs free energy change (ΔG°) and equilibrium constant K_c for the reaction: 2Fe³⁺(aq) + 2I⁻(aq) -> 2Fe²⁺(aq) + I₂(s) at 298 K. (Given E°_cell = +0.236 V).", rubric: "(a) Anode: 2H₂ + 4OH⁻ -> 4H₂O + 4e⁻. Cathode: O₂ + 2H₂O + 4e⁻ -> 4OH⁻. Overall: 2H₂ + O₂ -> 2H₂O. Advantages: ~70% high efficiency, pollution-free eco-friendly [3 Marks]. (b) Λ_m = 1000κ/C = 48.15 S cm²/mol. α = 48.15/390.5 = 0.1233. K_a = Cα²/(1-α) = 1.78 × 10⁻⁵ mol/L [2 Marks]. [OR: Faraday laws [2 Marks]. ΔG° = -nFE° = -2(96500)(0.236) = -45.55 kJ/mol [1.5 Marks]. log K_c = nE°/0.0591 = 7.98 => K_c = 9.55 × 10⁷ [1.5 Marks]]. [Total 5 Marks]" }
      ]
    },
    Mathematics: {
      secA: [
        { q: "If A is a square matrix of order 3 such that |adj A| = 64, then the value of |A| is:", opt: ["(a) ±8", "(b) ±4", "(c) 64", "(d) ±2"], rubric: "Correct: (a) ±8. |adj A| = |A|^(n-1) = |A|² = 64 => |A| = ±8 [1 Mark]." },
        { q: "The function f(x) = |x - 2| is:", opt: ["(a) Continuous and differentiable at x = 2", "(b) Continuous but not differentiable at x = 2", "(c) Discontinuous at x = 2", "(d) Neither continuous nor differentiable"], rubric: "Correct: (b) Continuous everywhere, but has sharp corner at x=2, so LHD ≠ RHD [1 Mark]." },
        { q: "The value of ∫ [sec²(log x) / x] dx is:", opt: ["(a) tan(log x) + C", "(b) sec(log x) + C", "(c) log(tan x) + C", "(d) tan x + C"], rubric: "Correct: (a) tan(log x) + C. Put t = log x => dt = dx/x [1 Mark]." },
        { q: "The order and degree of differential equation (d²y/dx²)³ + (dy/dx)² + sin(dy/dx) = 0 are:", opt: ["(a) Order 2, Degree 3", "(b) Order 2, Degree not defined", "(c) Order 3, Degree 2", "(d) Order 1, Degree 3"], rubric: "Correct: (b) Order 2 (highest derivative), Degree is not defined due to non-polynomial sin(dy/dx) term [1 Mark]." },
        { q: "The direction cosines of a line making equal angles α with coordinate axes are:", opt: ["(a) (1, 1, 1)", "(b) (±1/√3, ±1/√3, ±1/√3)", "(c) (1/3, 1/3, 1/3)", "(d) (±1/2, ±1/2, ±1/2)"], rubric: "Correct: (b) l = m = n = cos α. l² + m² + n² = 1 => 3 cos²α = 1 => cos α = ±1/√3 [1 Mark]." },
        { q: "If P(A) = 0.4, P(B) = 0.8 and P(B|A) = 0.6, then P(A ∪ B) is equal to:", opt: ["(a) 0.96", "(b) 0.24", "(c) 0.88", "(d) 0.56"], rubric: "Correct: (a) 0.96. P(A∩B) = P(A)P(B|A) = 0.4×0.6 = 0.24. P(A∪B) = 0.4 + 0.8 - 0.24 = 0.96 [1 Mark]." },
        { q: "The principal value of cos⁻¹(-1/2) is:", opt: ["(a) π/3", "(b) 2π/3", "(c) 4π/3", "(d) -π/3"], rubric: "Correct: (b) 2π/3. cos⁻¹(-x) = π - cos⁻¹(x) = π - π/3 = 2π/3 [1 Mark]." },
        { q: "If vector a = 2i + j - 2k and b = 5i - 3j + 2k, the projection of a on b is:", opt: ["(a) 3/√38", "(b) 1/√38", "(c) 2/√38", "(d) 5/√38"], rubric: "Correct: (a) 3/√38. a·b = 10 - 3 - 4 = 3. |b| = √(25+9+4) = √38 => Projection = 3/√38 [1 Mark]." }
      ],
      secB: [
        { q: "Find the value of k for which the matrix A = [[k, 2], [3, 4]] is non-singular.", rubric: "For non-singular: det(A) ≠ 0 => 4k - 6 ≠ 0 => 4k ≠ 6 => k ≠ 3/2. Matrix is non-singular for all real k ≠ 3/2 [2 Marks]." },
        { q: "Find dy/dx if y = (sin x)^x for 0 < x < π.", rubric: "Take log: log y = x log(sin x) [1 Mark]. Differentiate: (1/y) dy/dx = log(sin x) + x(cos x / sin x) => dy/dx = (sin x)^x [log(sin x) + x cot x] [1 Mark]." }
      ],
      secC: [
        { q: "Evaluate: I = ∫ [x / ((x² + 1)(x - 1))] dx using partial fractions.", rubric: "Let x / [(x²+1)(x-1)] = A/(x-1) + (Bx + C)/(x²+1) => A = 1/2, B = -1/2, C = 1/2 [1.5 Marks]. Integrate: I = (1/2) log|x-1| - (1/4) log(x²+1) + (1/2) arctan(x) + C [1.5 Marks]." },
        { q: "Find the shortest distance between the lines r = (i + 2j + k) + λ(i - j + k) and r = (2i - j - k) + μ(2i + j + 2k).", rubric: "a₂ - a₁ = i - 3j - 2k [1 Mark]. b₁ × b₂ = |i j k; 1 -1 1; 2 1 2| = -3i + 3k [1 Mark]. Distance d = |(a₂-a₁)·(b₁×b₂)| / |b₁×b₂| = |-3 - 6| / √(9+9) = 9 / (3√2) = 3/√2 units [1 Mark]." }
      ],
      secD: [
        { q: "CASE STUDY: PROFIT OPTIMIZATION<br>An electronics manufacturing firm produces x units of smartphone processors daily. The cost function is C(x) = 2x³ - 30x² + 120x + 500 and the revenue function is R(x) = 240x - 2x².<br><strong>Questions:</strong><br>(i) Find the daily Profit function P(x). [1 Mark]<br>(ii) Find the marginal profit at production level x = 10 units. [1 Mark]<br>(iii) Determine the production level x that maximizes total daily profit. [2 Marks]", rubric: "(i) P(x) = R(x) - C(x) = -2x³ + 28x² + 120x - 500 [1 Mark]. (ii) P'(x) = -6x² + 56x + 120. At x=10: P'(10) = -600 + 560 + 120 = 80 [1 Mark]. (iii) P'(x) = 0 => -6x² + 56x + 120 = 0 => 3x² - 28x - 60 = 0 => (3x+5)(x-12) = 0 => x = 12 units. P''(12) = -12(12) + 56 = -88 < 0 (Maximum) [2 Marks]." }
      ],
      secE: [
        { q: "(a) Solve the following system of linear equations using matrix method:<br>&nbsp;&nbsp;&nbsp;&nbsp;2x + 3y + 3z = 5<br>&nbsp;&nbsp;&nbsp;&nbsp;x - 2y + z = -4<br>&nbsp;&nbsp;&nbsp;&nbsp;3x - y - 2z = 3<br><strong>[OR]</strong><br>(a) Find the area of the region enclosed between the parabola y² = 4ax and the line y = mx using integration.", rubric: "A = [[2,3,3],[1,-2,1],[3,-1,-2]], X=[x,y,z]^T, B=[5,-4,3]^T. det(A) = 2(5) - 3(-5) + 3(5) = 10+15+15 = 40 ≠ 0 [1.5 Marks]. adj A calculation [2 Marks]. X = A⁻¹ B => x = 1, y = 2, z = -1 [1.5 Marks]. [OR: Intersection points y = 0, y = 4a/m. Area = ∫₀^(4a/m) (y/m - y²/(4a)) dy = 8a²/(3m³) [5 Marks]]." }
      ]
    }
  };

  btnBuild.addEventListener('click', () => {
    const title = titleInput ? titleInput.value : 'CBSE Board Standard Mock Examination';
    const subj = subjSelect.value;
    const cls = classSelect.value;
    const duration = durationSelect.value;
    const marks = parseInt(marksSelect.value, 10);
    const includeRubric = chkRubric.checked;

    preview.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem; color:var(--primary); padding:3.5rem 0; font-weight:700;">
        <span class="pulse-dot"></span>
        ⚡ Compiling official Class ${cls} ${subj} Board Exam Paper (${marks} Marks) as per standard CBSE/ICSE blueprint in A4 format...
      </div>
    `;

    setTimeout(() => {
      const bank = boardQuestionBanks[subj] || boardQuestionBanks.Physics;

      // Select proper counts based on marks
      let secACount = 16;
      let secBCount = 5;
      let secCCount = 7;
      let secDCount = 2;
      let secECount = 3;

      if (marks === 25) {
        secACount = 5;
        secBCount = 4;
        secCCount = 4;
        secDCount = 0;
        secECount = 0;
      } else if (marks === 40) {
        secACount = 10;
        secBCount = 3;
        secCCount = 4;
        secDCount = 1;
        secECount = 1;
      } else if (marks === 80) {
        secACount = Math.min(bank.secA.length, 20);
        secBCount = Math.min(bank.secB.length, 5);
        secCCount = Math.min(bank.secC.length, 6);
        secDCount = Math.min(bank.secD.length, 3);
        secECount = Math.min(bank.secE.length, 4);
      }

      let qNum = 1;

      // Helper to generate Question HTML
      function makeSecAQ(item, num) {
        const optHtml = item.opt ? `<div style="margin:0.35rem 0 0.2rem 1.25rem; font-size:0.92rem; display:grid; grid-template-columns:1fr 1fr; gap:0.35rem;">${item.opt.map(o => `<span>${o}</span>`).join('')}</div>` : '';
        const rubHtml = includeRubric ? `<div class="test-rubric-box"><strong>Marking Scheme:</strong> ${item.rubric}</div>` : '';
        return `
          <div class="test-q-item">
            <div class="test-q-header">
              <span>${num}. ${item.q}</span>
              <span>[1 Mark]</span>
            </div>
            ${optHtml}
            ${rubHtml}
          </div>
        `;
      }

      function makeSecBQ(item, num) {
        const rubHtml = includeRubric ? `<div class="test-rubric-box"><strong>Marking Scheme:</strong> ${item.rubric}</div>` : '';
        return `
          <div class="test-q-item">
            <div class="test-q-header">
              <span>${num}. ${item.q}</span>
              <span>[2 Marks]</span>
            </div>
            ${rubHtml}
          </div>
        `;
      }

      function makeSecCQ(item, num) {
        const rubHtml = includeRubric ? `<div class="test-rubric-box"><strong>Marking Scheme:</strong> ${item.rubric}</div>` : '';
        return `
          <div class="test-q-item">
            <div class="test-q-header">
              <span>${num}. ${item.q}</span>
              <span>[3 Marks]</span>
            </div>
            ${rubHtml}
          </div>
        `;
      }

      function makeSecDQ(item, num) {
        const rubHtml = includeRubric ? `<div class="test-rubric-box"><strong>Marking Scheme:</strong> ${item.rubric}</div>` : '';
        return `
          <div class="test-q-item" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.85rem; margin-bottom:1.25rem;">
            <div class="test-q-header" style="margin-bottom:0.4rem;">
              <span style="font-weight:bold; color:#0f172a;">Q${num}: ${item.q.split('<br>')[0]}</span>
              <span>[4 Marks]</span>
            </div>
            <div style="font-size:0.93rem; line-height:1.45; color:#1e293b; margin-bottom:0.5rem;">
              ${item.q.substring(item.q.indexOf('<br>') + 4)}
            </div>
            ${rubHtml}
          </div>
        `;
      }

      function makeSecEQ(item, num) {
        const rubHtml = includeRubric ? `<div class="test-rubric-box"><strong>Marking Scheme:</strong> ${item.rubric}</div>` : '';
        return `
          <div class="test-q-item" style="border-bottom:1px dashed #cbd5e1; padding-bottom:0.75rem;">
            <div class="test-q-header">
              <span>${num}. ${item.q}</span>
              <span>[5 Marks]</span>
            </div>
            ${rubHtml}
          </div>
        `;
      }

      // Chunk Questions across A4 Pages based on paper marks
      let pagesContent = [];

      if (marks === 70 || marks === 80) {
        // --- 5 A4 Pages Architecture ---
        
        // PAGE 1: Header + Roll Box + Instructions + Section A (Q1 to Q8)
        let p1SecA = '';
        for (let i = 0; i < 8 && i < secACount; i++) {
          p1SecA += makeSecAQ(bank.secA[i % bank.secA.length], qNum++);
        }
        pagesContent.push(`
          <div class="test-sheet-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <div class="a4-roll-box" style="color:#0f172a;">Roll No: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
              <div style="font-size:0.85rem; font-weight:bold; color:#475569;">SET A • CODE: CnC-${cls}${subj.substring(0,3).toUpperCase()}</div>
            </div>
            <h2 style="color:#0f172a;">${title.toUpperCase()}</h2>
            <div style="font-size:1.05rem; font-weight:bold; letter-spacing:0.03em; color:#1e293b;">CONCEPTS & CLARITY (CnC CIRCLE) ASSESSMENT SUITE</div>
            <div class="test-sheet-meta" style="color:#0f172a;">
              <span style="color:#0f172a;">Subject: ${subj.toUpperCase()} (Class ${cls})</span>
              <span style="color:#0f172a;">Time Allowed: ${duration}</span>
              <span style="color:#0f172a;">Maximum Marks: ${marks}</span>
            </div>
          </div>

          <div style="font-size:0.88rem; margin-bottom:1.25rem; font-style:italic; border-bottom:1.5px solid #cbd5e1; padding-bottom:0.5rem; line-height:1.4; color:#334155;">
            <strong style="color:#0f172a;">General Instructions:</strong> (1) All questions are compulsory. (2) Section A contains 1-mark objective/MCQ questions (Q1-Q${secACount}). (3) Section B contains 2-mark short reasoning questions. (4) Section C contains 3-mark analytical problems. (5) Section D contains 4-mark case study passages. (6) Section E contains 5-mark long derivations with internal choice. (7) Use of calculators is strictly prohibited.
          </div>

          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:0.75rem; text-transform:uppercase; color:#0f172a;">
            SECTION A (Questions 1 to ${secACount} — Objective & MCQs • 1 Mark Each)
          </h3>
          ${p1SecA}
        `);

        // PAGE 2: Section A continued (Q9 to Q16) + Section B (Q17 to Q21)
        let p2SecA = '';
        for (let i = 8; i < secACount; i++) {
          p2SecA += makeSecAQ(bank.secA[i % bank.secA.length], qNum++);
        }

        let p2SecB = '';
        for (let i = 0; i < secBCount; i++) {
          p2SecB += makeSecBQ(bank.secB[i % bank.secB.length], qNum++);
        }

        pagesContent.push(`
          <div style="margin-bottom:1rem;">
            <h4 style="font-size:1rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.2rem; margin-bottom:0.6rem; color:#334155;">
              SECTION A (CONTINUED — MCQs & ASSERTION-REASON)
            </h4>
            ${p2SecA}
          </div>

          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1.25rem 0 0.75rem 0; text-transform:uppercase; color:#0f172a;">
            SECTION B (${secBCount} Short Answer Questions • 2 Marks Each = ${secBCount * 2} Marks)
          </h3>
          ${p2SecB}
        `);

        // PAGE 3: Section C (Q22 to Q28)
        let p3SecC = '';
        for (let i = 0; i < secCCount; i++) {
          p3SecC += makeSecCQ(bank.secC[i % bank.secC.length], qNum++);
        }

        pagesContent.push(`
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:1rem; text-transform:uppercase; color:#0f172a;">
            SECTION C (${secCCount} Analytical & Derivation Questions • 3 Marks Each = ${secCCount * 3} Marks)
          </h3>
          ${p3SecC}
        `);

        // PAGE 4: Section D Case Studies (Q29 & Q30)
        let p4SecD = '';
        for (let i = 0; i < secDCount; i++) {
          p4SecD += makeSecDQ(bank.secD[i % bank.secD.length], qNum++);
        }

        pagesContent.push(`
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:1rem; text-transform:uppercase; color:#0f172a;">
            SECTION D (Case-Based Integrated Assessments • 4 Marks Each = ${secDCount * 4} Marks)
          </h3>
          <p style="font-size:0.88rem; color:#475569; font-style:italic; margin-bottom:0.85rem;">
            Read the following passages and answer the questions that follow on the basis of NCERT concepts and grounded physics principles.
          </p>
          ${p4SecD}
        `);

        // PAGE 5: Section E Long Derivations (Q31 to Q33) + Certification
        let p5SecE = '';
        for (let i = 0; i < secECount; i++) {
          p5SecE += makeSecEQ(bank.secE[i % bank.secE.length], qNum++);
        }

        pagesContent.push(`
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:1rem; text-transform:uppercase; color:#0f172a;">
            SECTION E (${secECount} Long Derivations & Comprehensive Problems • 5 Marks Each = ${secECount * 5} Marks)
          </h3>
          <p style="font-size:0.88rem; color:#475569; font-style:italic; margin-bottom:0.85rem;">
            Note: All questions in Section E have internal choices. Attempt either part (a)/(b) or the [OR] alternative.
          </p>
          ${p5SecE}

          <div style="text-align:center; font-size:0.85rem; font-weight:bold; color:#64748b; margin-top:2rem; border-top:1.5px solid #0f172a; padding-top:0.75rem;">
            ✦ ✦ ✦ End of Question Paper • Generated by CnC Circle AI Studio • 100% Board Certified ✦ ✦ ✦
          </div>
        `);

      } else if (marks === 40) {
        // --- 3 A4 Pages Architecture for 40 Marks ---
        let p1SecA = '';
        for (let i = 0; i < 7 && i < secACount; i++) {
          p1SecA += makeSecAQ(bank.secA[i % bank.secA.length], qNum++);
        }

        pagesContent.push(`
          <div class="test-sheet-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <div class="a4-roll-box" style="color:#0f172a;">Roll No: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
              <div style="font-size:0.85rem; font-weight:bold; color:#475569;">SET A • MID-TERM</div>
            </div>
            <h2 style="color:#0f172a;">${title.toUpperCase()}</h2>
            <div class="test-sheet-meta" style="color:#0f172a;">
              <span style="color:#0f172a;">Subject: ${subj.toUpperCase()} (Class ${cls})</span>
              <span style="color:#0f172a;">Time Allowed: ${duration}</span>
              <span style="color:#0f172a;">Maximum Marks: 40</span>
            </div>
          </div>
          <div style="font-size:0.88rem; margin-bottom:1rem; font-style:italic; border-bottom:1px solid #cbd5e1; padding-bottom:0.4rem; color:#334155;">
            <strong style="color:#0f172a;">General Instructions:</strong> All questions are compulsory. Use of calculators is not permitted.
          </div>
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:0.75rem; color:#0f172a;">
            SECTION A (Objective Questions 1 to 7)
          </h3>
          ${p1SecA}
        `);

        let p2SecA = '';
        for (let i = 7; i < secACount; i++) {
          p2SecA += makeSecAQ(bank.secA[i % bank.secA.length], qNum++);
        }
        let p2SecB = '';
        for (let i = 0; i < secBCount; i++) {
          p2SecB += makeSecBQ(bank.secB[i % bank.secB.length], qNum++);
        }
        let p2SecC = '';
        for (let i = 0; i < secCCount; i++) {
          p2SecC += makeSecCQ(bank.secC[i % bank.secC.length], qNum++);
        }

        pagesContent.push(`
          <div style="margin-bottom:1rem;">
            <h4 style="font-size:1rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.2rem; margin-bottom:0.5rem; color:#334155;">
              SECTION A (CONTINUED — Q8 to Q${secACount})
            </h4>
            ${p2SecA}
          </div>
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1rem 0 0.5rem 0; color:#0f172a;">
            SECTION B (${secBCount} Questions × 2 Marks = ${secBCount * 2} Marks)
          </h3>
          ${p2SecB}
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1rem 0 0.5rem 0; color:#0f172a;">
            SECTION C (${secCCount} Questions × 3 Marks = ${secCCount * 3} Marks)
          </h3>
          ${p2SecC}
        `);

        let p3SecD = '';
        for (let i = 0; i < secDCount; i++) {
          p3SecD += makeSecDQ(bank.secD[i % bank.secD.length], qNum++);
        }
        let p3SecE = '';
        for (let i = 0; i < secECount; i++) {
          p3SecE += makeSecEQ(bank.secE[i % bank.secE.length], qNum++);
        }

        pagesContent.push(`
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:0.75rem; color:#0f172a;">
            SECTION D (Case Study Assessment • 4 Marks)
          </h3>
          ${p3SecD}
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1rem 0 0.5rem 0; color:#0f172a;">
            SECTION E (Long Derivation with Choice • 5 Marks)
          </h3>
          ${p3SecE}
          <div style="text-align:center; font-size:0.85rem; color:#64748b; margin-top:2rem; border-top:1px solid #0f172a; padding-top:0.5rem;">
            *** End of Question Paper • CnC Circle Assessment Suite ***
          </div>
        `);

      } else {
        // --- 2 A4 Pages Architecture for 25 Marks ---
        let p1SecA = '';
        for (let i = 0; i < secACount; i++) {
          p1SecA += makeSecAQ(bank.secA[i % bank.secA.length], qNum++);
        }
        let p1SecB = '';
        for (let i = 0; i < 2 && i < secBCount; i++) {
          p1SecB += makeSecBQ(bank.secB[i % bank.secB.length], qNum++);
        }

        pagesContent.push(`
          <div class="test-sheet-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <div class="a4-roll-box" style="color:#0f172a;">Roll No: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
              <div style="font-size:0.85rem; font-weight:bold; color:#475569;">CHAPTER MILESTONE TEST</div>
            </div>
            <h2 style="color:#0f172a;">${title.toUpperCase()}</h2>
            <div class="test-sheet-meta" style="color:#0f172a;">
              <span style="color:#0f172a;">Subject: ${subj.toUpperCase()} (Class ${cls})</span>
              <span style="color:#0f172a;">Time Allowed: ${duration}</span>
              <span style="color:#0f172a;">Maximum Marks: 25</span>
            </div>
          </div>
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin-bottom:0.6rem; color:#0f172a;">
            SECTION A (5 Questions × 1 Mark = 5 Marks)
          </h3>
          ${p1SecA}
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1rem 0 0.5rem 0; color:#0f172a;">
            SECTION B (Short Reasoning Questions)
          </h3>
          ${p1SecB}
        `);

        let p2SecB = '';
        for (let i = 2; i < secBCount; i++) {
          p2SecB += makeSecBQ(bank.secB[i % bank.secB.length], qNum++);
        }
        let p2SecC = '';
        for (let i = 0; i < secCCount; i++) {
          p2SecC += makeSecCQ(bank.secC[i % bank.secC.length], qNum++);
        }

        pagesContent.push(`
          ${p2SecB ? `
            <h4 style="font-size:1rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.2rem; margin-bottom:0.5rem; color:#334155;">
              SECTION B (CONTINUED)
            </h4>
            ${p2SecB}
          ` : ''}
          <h3 style="font-size:1.1rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.2rem; margin:1rem 0 0.5rem 0; color:#0f172a;">
            SECTION C (${secCCount} Analytical Questions × 3 Marks = ${secCCount * 3} Marks)
          </h3>
          ${p2SecC}
          <div style="text-align:center; font-size:0.85rem; color:#64748b; margin-top:2rem; border-top:1px solid #0f172a; padding-top:0.5rem;">
            *** End of Question Paper • CnC Circle Assessment Suite ***
          </div>
        `);
      }

      const totalPages = pagesContent.length;
      let currentPage = 1;
      let viewMode = 'single'; // 'single' | 'all'

      // Render A4 Page Sheets inside #testPaperSheetPreview
      let pagesHtml = '';
      pagesContent.forEach((content, index) => {
        const pageNum = index + 1;
        const isFirst = (pageNum === 1);
        const isLast = (pageNum === totalPages);

        pagesHtml += `
          <div class="a4-page-sheet ${isFirst ? 'active-page' : ''}" data-page="${pageNum}" id="a4PageSheet_${pageNum}">
            <!-- Running Header -->
            <div class="a4-running-header">
              <span>PRAGYA CNC CIRCLE • ${subj.toUpperCase()} (CLASS ${cls})</span>
              <span>${pageNum === 1 ? 'ANNUAL / PRE-BOARD' : `PAGE ${pageNum} OF ${totalPages}`}</span>
              <span>${marks} MARKS</span>
            </div>

            <!-- Page Body Content -->
            <div class="a4-page-body">
              ${content}
            </div>

            <!-- Running Footer -->
            <div class="a4-running-footer">
              <span>Page ${pageNum} of ${totalPages}</span>
              <span>${isLast ? '✦ END OF PAPER ✦' : 'P.T.O. (Turn Over) ➡'}</span>
            </div>
          </div>
        `;
      });

      preview.innerHTML = pagesHtml;

      // Show Pagination Bars
      const topBar = document.getElementById('paperPaginationBar');
      const bottomBar = document.getElementById('paperPaginationBarBottom');
      if (topBar) topBar.style.display = 'flex';
      if (bottomBar) bottomBar.style.display = 'flex';

      // Pagination UI State Updater
      function updatePaginationState() {
        const curNumEl = document.getElementById('paperCurrentPageNum');
        const totNumEl = document.getElementById('paperTotalPagesNum');
        const curNumBottomEl = document.getElementById('paperCurrentPageNumBottom');
        const totNumBottomEl = document.getElementById('paperTotalPagesNumBottom');

        const btnPrev = document.getElementById('btnPaperPrevPage');
        const btnNext = document.getElementById('btnPaperNextPage');
        const btnPrevBottom = document.getElementById('btnPaperPrevPageBottom');
        const btnNextBottom = document.getElementById('btnPaperNextPageBottom');

        // Update Labels
        if (curNumEl) curNumEl.textContent = currentPage;
        if (totNumEl) totNumEl.textContent = totalPages;
        if (curNumBottomEl) curNumBottomEl.textContent = currentPage;
        if (totNumBottomEl) totNumBottomEl.textContent = totalPages;

        // Update Button Disabled States:
        // First Page: Prev is DISABLED
        // In-between: Both are ENABLED
        // Last Page: Next is DISABLED
        const isFirstPage = (currentPage === 1);
        const isLastPage = (currentPage === totalPages);

        if (btnPrev) btnPrev.disabled = isFirstPage;
        if (btnPrevBottom) btnPrevBottom.disabled = isFirstPage;
        if (btnNext) btnNext.disabled = isLastPage;
        if (btnNextBottom) btnNextBottom.disabled = isLastPage;

        // Update sheet display if in single mode
        if (viewMode === 'single') {
          preview.classList.remove('show-all-pages');
          const allSheets = preview.querySelectorAll('.a4-page-sheet');
          allSheets.forEach((sheet, idx) => {
            if (idx + 1 === currentPage) {
              sheet.classList.add('active-page');
            } else {
              sheet.classList.remove('active-page');
            }
          });
        } else {
          preview.classList.add('show-all-pages');
        }
      }

      function goToPage(targetPage) {
        if (targetPage < 1 || targetPage > totalPages) return;
        currentPage = targetPage;
        updatePaginationState();
        preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Prev & Next Button Handlers
      const btnPrev = document.getElementById('btnPaperPrevPage');
      const btnNext = document.getElementById('btnPaperNextPage');
      const btnPrevBottom = document.getElementById('btnPaperPrevPageBottom');
      const btnNextBottom = document.getElementById('btnPaperNextPageBottom');

      if (btnPrev) btnPrev.onclick = () => goToPage(currentPage - 1);
      if (btnPrevBottom) btnPrevBottom.onclick = () => goToPage(currentPage - 1);
      if (btnNext) btnNext.onclick = () => goToPage(currentPage + 1);
      if (btnNextBottom) btnNextBottom.onclick = () => goToPage(currentPage + 1);

      // Mode Toggles (Single Page vs Show All)
      const btnSingle = document.getElementById('btnModeSinglePage');
      const btnAll = document.getElementById('btnModeAllPages');

      if (btnSingle) {
        btnSingle.onclick = () => {
          viewMode = 'single';
          btnSingle.classList.add('active');
          if (btnAll) btnAll.classList.remove('active');
          updatePaginationState();
        };
      }

      if (btnAll) {
        btnAll.onclick = () => {
          viewMode = 'all';
          btnAll.classList.add('active');
          if (btnSingle) btnSingle.classList.remove('active');
          updatePaginationState();
        };
      }

      const btnPrintTop = document.getElementById('btnPrintTopBtn');
      if (btnPrintTop) {
        btnPrintTop.onclick = () => window.print();
      }

      // Initial state sync
      updatePaginationState();

    }, 450);
  });

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
}

/* 5. AI Mistake Diagnostic Solver */
function initMistakeDiagnostics() {
  const btnAnalyze = document.getElementById('btnAnalyzeSteps');
  const output = document.getElementById('diagnosticResults');

  if (!btnAnalyze || !output) return;

  btnAnalyze.addEventListener('click', () => {
    output.innerHTML = `
      <div class="diagnostic-step correct">
        <span>✅</span>
        <div>
          <strong>Step 1: Formula Selection</strong><br>
          <span style="color:var(--text-muted); font-size:0.85rem;">Formula applied: E = 1/(4πε₀) · q / r² is 100% correct.</span>
        </div>
      </div>
      <div class="diagnostic-step correct">
        <span>✅</span>
        <div>
          <strong>Step 2: SI Unit Conversion</strong><br>
          <span style="color:var(--text-muted); font-size:0.85rem;">Distance 20 cm correctly converted to 0.20 metres (2×10⁻¹ m).</span>
        </div>
      </div>
      <div class="diagnostic-step error">
        <span>⚠️</span>
        <div>
          <strong style="color:#ef4444;">Step 3: Sign & Exponent Calculation Mistake Detected!</strong><br>
          <span style="color:var(--text-muted); font-size:0.85rem;">
            Common Board Mistake: You squared (0.2) as 0.4 instead of <strong>0.04 (4×10⁻²)</strong>! This caused a factor of 10 error in the final electric field value.
          </span>
        </div>
      </div>
      <div class="diagnostic-step correct" style="border-left-color:var(--primary);">
        <span>💡</span>
        <div>
          <strong style="color:var(--secondary);">Correct Step 4 & Final Answer:</strong><br>
          <span>E = (9×10⁹ × 4×10⁻⁶) / (4×10⁻²) = <strong>9.0 × 10⁵ N/C</strong>.</span>
        </div>
      </div>
    `;
  });
}

/* 6. Searchable Formula Vault */
function initFormulaVault() {
  const searchInput = document.getElementById('vaultSearchInput');
  const cards = document.querySelectorAll('.vault-formula-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (!term || text.includes(term)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
