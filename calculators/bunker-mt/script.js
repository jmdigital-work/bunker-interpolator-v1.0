/* =========================================================
   MARINECALC PRO ACCESS CONTROL
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
   PRO ACCESS ELEMENTS
   ========================================================= */

const calculatorCard =
  document.querySelector(".calculator-card");


/* =========================================================
   PRO ACCESS OVERLAY
   ========================================================= */

function showProLock() {

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

      }
    );


  /*
    Create the PRO lock message.
  */

  const lockMessage =
    document.createElement("div");


  lockMessage.className =
    "pro-lock";


  lockMessage.innerHTML = `
    <div class="pro-lock-icon">
      🔒
    </div>

    <h2>
      MARINECALC PRO
    </h2>

    <p>
      This calculator is available with an active
      MarineCalc PRO subscription.
    </p>

    <p class="pro-price">
      $9 / 1 YEAR
    </p>

    <a
      href="../../pro/index.html"
      class="pro-upgrade-button"
    >
      GET PRO
    </a>

    <a
      href="../../auth/index.html"
      class="pro-account-link"
    >
      LOGIN / MY ACCOUNT
    </a>
  `;


  calculatorCard.prepend(
    lockMessage
  );

}


/* =========================================================
   CHECK PRO ACCESS
   ========================================================= */

async function checkProAccess() {

  try {

    /*
      First make sure the user is logged in.
    */

    const {
      data: sessionData,
      error: sessionError
    } =
      await supabaseClient
        .auth
        .getSession();


    if (sessionError) {

      console.error(
        "Session error:",
        sessionError
      );

      showProLock();

      return;

    }


    if (
      !sessionData.session ||
      !sessionData.session.user
    ) {

      showProLock();

      return;

    }


    /*
      Ask Supabase whether this user
      currently has valid PRO access.
    */

    const {
      data: isPro,
      error: proError
    } =
      await supabaseClient
        .rpc("is_pro");


    if (proError) {

      console.error(
        "PRO access check error:",
        proError
      );

      showProLock();

      return;

    }


    if (!isPro) {

      showProLock();

      return;

    }


    /*
      User is PRO.
      Calculator remains enabled.
    */

    console.log(
      "MarineCalc PRO access confirmed."
    );


  } catch (error) {

    console.error(
      "PRO access error:",
      error
    );

    showProLock();

  }

}


/* =========================================================
   START PRO ACCESS CHECK
   ========================================================= */

checkProAccess();


/* =========================================================
   MARINECALC
   BUNKER (MT) CALCULATOR
   SIMPLIFIED SHIPBOARD VERSION
   ========================================================= */


/* =========================================================
   ELEMENTS
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

     (Density of Fuel Oil @ 15°C)
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

    coefficient.value = "0.00064";


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

      calculateBunkerMass();

    }

  }
);