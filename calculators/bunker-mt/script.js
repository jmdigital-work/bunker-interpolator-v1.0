/* =========================================================
   MARINECALC
   BUNKER (MT) CALCULATOR
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const fuelType = document.getElementById("fuelType");

const actualVolume = document.getElementById("actualVolume");

const density15 = document.getElementById("density15");

const temperature = document.getElementById("temperature");

const coefficient = document.getElementById("coefficient");

const calculateButton =
  document.getElementById("calculateButton");

const correctedDensity =
  document.getElementById("correctedDensity");

const bunkerMass =
  document.getElementById("bunkerMass");

const errorMessage =
  document.getElementById("errorMessage");


/* =========================================================
   CALCULATION
   ========================================================= */

function calculateBunkerMass() {

  errorMessage.textContent = "";


  /* ---------------------------------------------
     Read values
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
     Validate inputs
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


  if (!Number.isFinite(volume) || volume < 0) {

    showError(
      "Actual Volume must be zero or greater."
    );

    return;

  }


  if (!Number.isFinite(density) || density <= 0) {

    showError(
      "Density @ 15°C must be greater than zero."
    );

    return;

  }


  if (!Number.isFinite(temp)) {

    showError(
      "Please enter a valid fuel temperature."
    );

    return;

  }


  if (!Number.isFinite(correction) || correction < 0) {

    showError(
      "Correction Coefficient must be zero or greater."
    );

    return;

  }


  /* ---------------------------------------------
     Temperature-corrected density

     ρT = ρ15 × [1 − C × (T − 15)]
     --------------------------------------------- */

  const corrected =
    density *
    (
      1 -
      correction *
      (temp - 15)
    );


  /* ---------------------------------------------
     Validate corrected density
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


  /* ---------------------------------------------
     Bunker mass

     MT = V × ρT ÷ 1000
     --------------------------------------------- */

  const massMT =
    volume *
    corrected /
    1000;


  /* ---------------------------------------------
     Display

     Density: 3 decimal places
     Mass: 4 decimal places
     --------------------------------------------- */

  correctedDensity.textContent =
    corrected.toFixed(4);

  bunkerMass.textContent =
    massMT.toFixed(4);

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

  errorMessage.textContent =
    message;

}


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

    if (event.key === "Enter") {

      calculateBunkerMass();

    }

  }
);