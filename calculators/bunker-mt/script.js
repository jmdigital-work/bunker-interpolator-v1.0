/* =========================================================
   MARINECALC
   BUNKER (MT) CALCULATOR
   PRO ACCESS + PREVIEW VERSION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
  "https://lasdhuckmemuukiqovyw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_39hL-GbiMsBs2zuJmGM6cg_g34fj8s6";


const {
  createClient
} = supabase;


const supabaseClient =
  createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   BUNKER ELEMENTS
   ========================================================= */

const actualVolume =
  document.getElementById("actualVolume");

const density15 =
  document.getElementById("density15");

const temperature =
  document.getElementById("temperature");

const coefficient =
  document.getElementById("coefficient");

const calculateButton =
  document.getElementById("calculateButton");

const clearButton =
  document.getElementById("clearButton");

const errorMessage =
  document.getElementById("errorMessage");

const correctedDensity =
  document.getElementById("correctedDensity");

const bunkerMass =
  document.getElementById("bunkerMass");


/* =========================================================
   AUDIT TRAIL ELEMENTS
   ========================================================= */

const auditDensity =
  document.getElementById("auditDensity");

const auditTemperature =
  document.getElementById("auditTemperature");

const auditCoefficient =
  document.getElementById("auditCoefficient");

const auditVolume =
  document.getElementById("auditVolume");

const auditTcdCalculation =
  document.getElementById("auditTcdCalculation");

const auditTcdResult =
  document.getElementById("auditTcdResult");

const auditMassCalculation =
  document.getElementById("auditMassCalculation");

const auditMassResult =
  document.getElementById("auditMassResult");


/* =========================================================
   CALCULATOR CARD
   ========================================================= */

const calculatorCard =
  document.querySelector(".calculator-card");


/* =========================================================
   PRO PREVIEW SAMPLE DATA
   =========================================================

   These values are ONLY used when the user does not
   have an active PRO subscription.

   They are clearly presented as demonstration data.
   ========================================================= */

const PREVIEW_DATA = {
  volume: "2044.33",
  density: "924.7",
  temperature: "45",
  coefficient: "0.00064"
};


/* =========================================================
   PRO PREVIEW STYLES
   ========================================================= */

function addPreviewStyles() {

  if (
    document.getElementById(
      "marinecalc-preview-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "marinecalc-preview-styles";


  style.textContent = `

    /* =====================================================
       PRO PREVIEW BANNER
       ===================================================== */

    .marinecalc-preview-banner {

      margin-bottom: 20px;

      padding: 16px 17px;

      border:
        1px solid
        #B9D3DF;

      border-radius: 10px;

      background:
        #EAF4F8;

    }


    .marinecalc-preview-banner strong {

      display: block;

      margin-bottom: 6px;

      color:
        #003B5C;

      font-size: 12px;

      font-weight: 900;

      letter-spacing: .5px;

    }


    .marinecalc-preview-banner p {

      margin:
        0 0 13px;

      color:
        #496474;

      font-size: 10px;

      line-height: 1.55;

    }


    /* =====================================================
       PREVIEW ACTIONS
       ===================================================== */

    .marinecalc-preview-actions {

      display: flex;

      flex-wrap: wrap;

      gap: 8px;

    }


    .marinecalc-preview-actions a {

      display: inline-flex;

      align-items: center;

      justify-content: center;

      min-height: 36px;

      padding:
        0 14px;

      border-radius: 6px;

      text-decoration: none;

      font-size: 10px;

      font-weight: 800;

      letter-spacing: .3px;

    }


    /* =====================================================
       GET PRO
       ===================================================== */

    .marinecalc-preview-pro {

      background:
        #176C8E;

      color:
        #FFFFFF;

    }


    .marinecalc-preview-pro:hover {

      background:
        #125B78;

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    .marinecalc-preview-login {

      border:
        1px solid
        #176C8E;

      background:
        #FFFFFF;

      color:
        #176C8E;

    }


    .marinecalc-preview-login:hover {

      background:
        #F2F8FA;

    }


    /* =====================================================
       PREVIEW DATA LABEL
       ===================================================== */

    .marinecalc-preview-label {

      margin-bottom: 14px;

      padding:
        7px 10px;

      border-radius: 5px;

      background:
        #243E52;

      color:
        #DCEAF1;

      font-size: 9px;

      font-weight: 800;

      letter-spacing: .5px;

    }


    .marinecalc-preview-label span {

      color:
        #FFFFFF;

    }


    /* =====================================================
       DISABLED PREVIEW CONTROLS
       ===================================================== */

    .marinecalc-preview-disabled {

      opacity:
        .82;

    }

  `;


  document.head.appendChild(style);

}


/* =========================================================
   SHOW PRO PREVIEW
   ========================================================= */

function showProPreview() {

  addPreviewStyles();


  /*
     Prevent duplicate preview banners.
  */

  if (
    document.getElementById(
      "marinecalcPreviewBanner"
    )
  ) {
    return;
  }


  /*
     Disable calculator controls.
  */

  document
    .querySelectorAll(
      ".calculator-card input, .calculator-card button"
    )
    .forEach(
      element => {

        element.disabled = true;

        element.classList.add(
          "marinecalc-preview-disabled"
        );

      }
    );


  /*
     Create preview banner.
  */

  const banner =
    document.createElement("div");


  banner.id =
    "marinecalcPreviewBanner";


  banner.className =
    "marinecalc-preview-banner";


  banner.innerHTML = `

    <strong>
      🔒 MARINECALC PRO PREVIEW
    </strong>

    <p>
      You're viewing a working demonstration of the
      Bunker (MT) Calculator. Sample data is shown for
      demonstration only. An active PRO subscription
      is required to enter your own vessel and fuel data.
    </p>

    <div class="marinecalc-preview-actions">

      <a
        href="../../pro/index.html"
        class="marinecalc-preview-pro"
      >
        GET PRO — $9 / 1 YEAR
      </a>

      <a
        href="../../auth/index.html"
        class="marinecalc-preview-login"
      >
        LOGIN / MY ACCOUNT
      </a>

    </div>

  `;


  /*
     Put banner at top of calculator.
  */

  calculatorCard.prepend(
    banner
  );


  /*
     Add preview label immediately
     above the calculator controls.
  */

  const previewLabel =
    document.createElement("div");


  previewLabel.className =
    "marinecalc-preview-label";


  previewLabel.innerHTML =
    "<span>PREVIEW DATA</span> — Sample values";


  /*
     Find first calculator section.
  */

  const firstSection =
    calculatorCard.querySelector(
      ".section"
    );


  if (firstSection) {

    firstSection.prepend(
      previewLabel
    );

  }


  /*
     Load sample values.
  */

  actualVolume.value =
    PREVIEW_DATA.volume;

  density15.value =
    PREVIEW_DATA.density;

  temperature.value =
    PREVIEW_DATA.temperature;

  coefficient.value =
    PREVIEW_DATA.coefficient;


  /*
     Calculate the demonstration result.
  */

  calculateBunkerMass();

}


/* =========================================================
   CHECK PRO ACCESS
   ========================================================= */

async function checkProAccess() {

  try {

    /*
       Check whether the user is logged in.
    */

    const {
      data: sessionData,
      error: sessionError
    } =
      await supabaseClient
        .auth
        .getSession();


    /*
       Session error.
       Treat as non-PRO and show preview.
    */

    if (sessionError) {

      console.error(
        "Session error:",
        sessionError
      );

      showProPreview();

      return;
    }


    /*
       User is not logged in.
       Show preview mode.
    */

    if (
      !sessionData.session ||
      !sessionData.session.user
    ) {

      showProPreview();

      return;
    }


    /*
       Ask Supabase whether the current
       user has active PRO access.
    */

    const {
      data: isPro,
      error: proError
    } =
      await supabaseClient
        .rpc("is_pro");


    /*
       PRO check failed.
       Fail safely into preview mode.
    */

    if (proError) {

      console.error(
        "PRO access check error:",
        proError
      );

      showProPreview();

      return;
    }


    /*
       User does not have active PRO.
       Show preview mode.
    */

    if (!isPro) {

      showProPreview();

      return;
    }


    /*
       User has active PRO.

       Do nothing.

       Calculator remains fully enabled.
    */

    console.log(
      "MarineCalc PRO access confirmed."
    );


  } catch (error) {

    console.error(
      "PRO access error:",
      error
    );


    /*
       Fail safely into preview mode.
    */

    showProPreview();

  }

}


/* =========================================================
   CALCULATE BUNKER MASS
   ========================================================= */

function calculateBunkerMass() {

  clearError();


  /* ---------------------------------------------
     Required fields
     --------------------------------------------- */

  if (
    actualVolume.value === "" ||
    density15.value === "" ||
    temperature.value === "" ||
    coefficient.value === ""
  ) {

    showError(
      "Please complete all required fields."
    );

    return;
  }


  /* ---------------------------------------------
     Convert values to numbers
     --------------------------------------------- */

  const volume =
    Number(actualVolume.value);

  const density =
    Number(density15.value);

  const temp =
    Number(temperature.value);

  const correction =
    Number(coefficient.value);


  /* ---------------------------------------------
     Validate volume
     --------------------------------------------- */

  if (
    !Number.isFinite(volume) ||
    volume <= 0
  ) {

    showError(
      "Actual Volume must be greater than zero."
    );

    return;
  }


  /* ---------------------------------------------
     Validate density
     --------------------------------------------- */

  if (
    !Number.isFinite(density) ||
    density <= 0
  ) {

    showError(
      "Density @ 15°C must be greater than zero."
    );

    return;
  }


  /* ---------------------------------------------
     Validate temperature
     --------------------------------------------- */

  if (
    !Number.isFinite(temp)
  ) {

    showError(
      "Please enter a valid fuel temperature."
    );

    return;
  }


  /* ---------------------------------------------
     Validate coefficient
     --------------------------------------------- */

  if (
    !Number.isFinite(correction) ||
    correction < 0
  ) {

    showError(
      "Correction Coefficient must be zero or greater."
    );

    return;
  }


  /* =================================================
     TEMPERATURE-CORRECTED DENSITY

     Formula:

     Density @ 15°C
     × [1 − {(T − 15) × C}]
     ================================================= */

  const corrected =
    density *
    (
      1 -
      (
        (temp - 15) *
        correction
      )
    );


  /* ---------------------------------------------
     Validate result
     --------------------------------------------- */

  if (
    !Number.isFinite(corrected) ||
    corrected <= 0
  ) {

    showError(
      "The calculated density is not valid. Check the inputs and coefficient."
    );

    return;
  }


  /* =================================================
     BUNKER MASS

     Formula:

     Actual Volume × Corrected Density ÷ 1000
     ================================================= */

  const massMT =
    volume *
    corrected /
    1000;


  /* =================================================
     DISPLAY RESULTS
     ================================================= */

  correctedDensity.textContent =
    corrected.toFixed(4);

  bunkerMass.textContent =
    massMT.toFixed(4);


  /* =================================================
     AUDIT TRAIL
     ================================================= */

  /*
     Input values
  */

  auditDensity.textContent =
    density.toFixed(1) +
    " kg/m³";


  auditTemperature.textContent =
    temp.toFixed(2) +
    " °C";


  auditCoefficient.textContent =
    correction;


  auditVolume.textContent =
    volume.toFixed(2) +
    " m³";


  /*
     Temperature-Corrected Density

     Density × [1 − {(T − 15) × coefficient}]
  */

  auditTcdCalculation.textContent =
    density.toFixed(1) +
    " × [1 − {(" +
    temp.toFixed(2) +
    " − 15) × " +
    correction +
    "}]";


  auditTcdResult.textContent =
    corrected.toFixed(4);


  /*
     Bunker Mass

     Volume × Corrected Density ÷ 1000
  */

  auditMassCalculation.textContent =
    volume.toFixed(2) +
    " × " +
    corrected.toFixed(4) +
    " ÷ 1000";


  auditMassResult.textContent =
    massMT.toFixed(4);

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

  errorMessage.textContent =
    message;

}


function clearError() {

  errorMessage.textContent =
    "";

}


/* =========================================================
   CLEAR
   ========================================================= */

clearButton.addEventListener(
  "click",
  function () {

    /* ---------------------------------------------
       Clear inputs
       --------------------------------------------- */

    actualVolume.value = "";

    density15.value = "";

    temperature.value = "";

    coefficient.value =
      "0.00064";


    /* ---------------------------------------------
       Clear results
       --------------------------------------------- */

    correctedDensity.textContent =
      "—";

    bunkerMass.textContent =
      "—";


    /* ---------------------------------------------
       Reset audit trail
       --------------------------------------------- */

    auditDensity.textContent =
      "—";

    auditTemperature.textContent =
      "—";

    auditCoefficient.textContent =
      "—";

    auditVolume.textContent =
      "—";

    auditTcdCalculation.textContent =
      "—";

    auditTcdResult.textContent =
      "—";

    auditMassCalculation.textContent =
      "—";

    auditMassResult.textContent =
      "—";


    /* ---------------------------------------------
       Clear error
       --------------------------------------------- */

    clearError();

  }
);


/* =========================================================
   CALCULATE BUTTON
   ========================================================= */

calculateButton.addEventListener(
  "click",
  calculateBunkerMass
);


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" &&
      event.target.tagName !== "TEXTAREA"
    ) {

      /*
         Don't allow keyboard calculation
         while the calculator is disabled.
      */

      if (
        calculateButton.disabled
      ) {
        return;
      }


      calculateBunkerMass();

    }

  }
);


/* =========================================================
   START PRO ACCESS CHECK
   ========================================================= */

checkProAccess();