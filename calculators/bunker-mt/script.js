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
   CALCULATE
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

  if (!Number.isFinite(temp)) {

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

     Actual Volume × Corrected Density ÷ 1000
     ================================================= */

  const massMT =
    volume *
    corrected /
    1000;


  /* ---------------------------------------------
     Display
     --------------------------------------------- */

  correctedDensity.textContent =
    corrected.toFixed(4);

  bunkerMass.textContent =
    massMT.toFixed(4);

/* =================================================
   AUDIT TRAIL
   ================================================= */

auditDensity.textContent =
  density.toFixed(4) + " kg/m³";

auditTemperature.textContent =
  temp.toFixed(4) + " °C";

auditCoefficient.textContent =
  correction;

auditVolume.textContent =
  volume.toFixed(4) + " m³";


auditTcdCalculation.textContent =
  density.toFixed(4) +
  " × [1 − {(" +
  temp.toFixed(4) +
  " − 15) × " +
  correction +
  "}]";


auditTcdResult.textContent =
  corrected.toFixed(4);


auditMassCalculation.textContent =
  volume.toFixed(4) +
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

    actualVolume.value = "";

    density15.value = "";

    temperature.value = "";

    coefficient.value = "0.00064";


    correctedDensity.textContent = "—";

    bunkerMass.textContent = "—";


    /* Reset calculation audit trail */

    auditDensity.textContent = "—";

    auditTemperature.textContent = "—";

    auditCoefficient.textContent = "—";

    auditVolume.textContent = "—";

    auditTcdCalculation.textContent = "—";

    auditTcdResult.textContent = "—";

    auditMassCalculation.textContent = "—";

    auditMassResult.textContent = "—";


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