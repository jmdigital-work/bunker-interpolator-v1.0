/* =========================================================
   MARINECALC
   NOON CALCULATION
   ========================================================= */


/* =========================================================
   STATE
   ========================================================= */

let calculatedTotalRevolution = null;
let calculatedAverageRpm = null;

let calculatedConstantRev = null;
let calculatedConstantRpm = null;

let calculatedPropellerDistance = null;
let calculatedPropellerSpeed = null;


/* =========================================================
   HELPERS
   ========================================================= */

function numberValue(id) {

  return Number(
    document.getElementById(id).value
  );

}


function isBlank(id) {

  return (
    document.getElementById(id).value.trim() === ""
  );

}


function setText(id, value) {

  document.getElementById(id).textContent = value;

}


function setError(id, message) {

  document.getElementById(id).textContent = message;

}


/* =========================================================
   MAIN SHAFT RPM
   ========================================================= */

function calculateRPM() {

  setError("rpmError", "");


  if (
    isBlank("counterPrevious") ||
    isBlank("counterPresent") ||
    isBlank("runningTime")
  ) {

    setError(
      "rpmError",
      "Please enter all Main Shaft RPM inputs."
    );

    return;

  }


  const previous =
    numberValue("counterPrevious");

  const present =
    numberValue("counterPresent");

  const time =
    numberValue("runningTime");


  if (
    !Number.isFinite(previous) ||
    !Number.isFinite(present) ||
    !Number.isFinite(time)
  ) {

    setError(
      "rpmError",
      "Please enter valid numerical values."
    );

    return;

  }


  if (present < previous) {

    setError(
      "rpmError",
      "Present Counter Reading cannot be less than Previous Counter Reading."
    );

    return;

  }


  if (time <= 0) {

    setError(
      "rpmError",
      "Running Time must be greater than zero."
    );

    return;

  }


  /* ---------------------------------------------
     Total Revolution
     --------------------------------------------- */

  calculatedTotalRevolution =
    present - previous;


  /* ---------------------------------------------
     Average RPM
     --------------------------------------------- */

  calculatedAverageRpm =
    calculatedTotalRevolution /
    (time * 60);


  /* ---------------------------------------------
     Display
     --------------------------------------------- */

  setText(
    "totalRevolution",
    calculatedTotalRevolution.toFixed(0)
  );


  setText(
    "averageRpm",
    calculatedAverageRpm.toFixed(2)
  );


  /* ---------------------------------------------
     Carry into Propeller
     --------------------------------------------- */

  setText(
    "propTotalRevolution",
    calculatedTotalRevolution.toFixed(0) + " rev"
  );


  setText(
    "propAverageRpm",
    calculatedAverageRpm.toFixed(2) + " RPM"
  );


  updateCarriedValues();

}


/* =========================================================
   CONSTANT MODE
   ========================================================= */

function getConstantMode() {

  return document.querySelector(
    'input[name="constantMode"]:checked'
  ).value;

}


/* =========================================================
   DISTANCE MODE
   ========================================================= */

function getDistanceMode() {

  return document.querySelector(
    'input[name="distanceMode"]:checked'
  ).value;

}


/* =========================================================
   PROPELLER
   ========================================================= */

function calculatePropeller() {

  setError("propellerError", "");


  if (
    calculatedTotalRevolution === null ||
    calculatedAverageRpm === null
  ) {

    setError(
      "propellerError",
      "Calculate Main Shaft RPM first."
    );

    return;

  }


  const constantMode =
    getConstantMode();

  const distanceMode =
    getDistanceMode();


  let constantRev;


  /* =====================================================
     CONSTANT REV
     ===================================================== */

  if (constantMode === "calculate") {

    if (isBlank("propellerPitch")) {

      setError(
        "propellerError",
        "Enter Propeller Pitch when calculating ConstantREV from Pitch."
      );

      return;

    }


    const pitchMm =
      numberValue("propellerPitch");


    if (
      !Number.isFinite(pitchMm) ||
      pitchMm <= 0
    ) {

      setError(
        "propellerError",
        "Propeller Pitch must be greater than zero."
      );

      return;

    }


    /*
      Convert mm → m
    */

    const pitchMeters =
      pitchMm / 1000;


    /*
      ConstantREV =
      Pitch (m) / 1852
    */

    constantRev =
      pitchMeters / 1852;

  }


  else {

    if (isBlank("manualConstantRev")) {

      setError(
        "propellerError",
        "Enter the manual Propeller ConstantREV."
      );

      return;

    }


    constantRev =
      numberValue("manualConstantRev");


    if (
      !Number.isFinite(constantRev) ||
      constantRev <= 0
    ) {

      setError(
        "propellerError",
        "Propeller ConstantREV must be greater than zero."
      );

      return;

    }

  }


  /* =====================================================
     CONSTANT RPM
     ===================================================== */

  const constantRpm =
    constantRev * 60;


  /* =====================================================
     PROPELLER DISTANCE
     ===================================================== */

  let distance;


  if (distanceMode === "calculate") {

    distance =
      constantRev *
      calculatedTotalRevolution;

  }


  else {

    if (isBlank("manualPropellerDistance")) {

      setError(
        "propellerError",
        "Enter the manual Propeller Distance."
      );

      return;

    }


    distance =
      numberValue("manualPropellerDistance");


    if (
      !Number.isFinite(distance) ||
      distance < 0
    ) {

      setError(
        "propellerError",
        "Propeller Distance cannot be negative."
      );

      return;

    }

  }


  /* =====================================================
     PROPELLER SPEED
     ===================================================== */

  const speed =
    constantRpm *
    calculatedAverageRpm;


  /* =====================================================
     STORE
     ===================================================== */

  calculatedConstantRev =
    constantRev;

  calculatedConstantRpm =
    constantRpm;

  calculatedPropellerDistance =
    distance;

  calculatedPropellerSpeed =
    speed;


  /* =====================================================
     DISPLAY
     ===================================================== */

  setText(
    "constantRev",
    constantRev.toFixed(6)
  );


  setText(
    "constantRpm",
    constantRpm.toFixed(5)
  );


  setText(
    "propellerDistance",
    distance.toFixed(1)
  );


  setText(
    "propellerSpeed",
    speed.toFixed(2)
  );


  updateCarriedValues();

}


/* =========================================================
   CARRIED VALUES
   ========================================================= */

function updateCarriedValues() {

  if (
    calculatedPropellerDistance !== null
  ) {

    setText(
      "speedPropellerDistance",
      calculatedPropellerDistance.toFixed(1) +
      " Nm"
    );

  }
  else {

    setText(
      "speedPropellerDistance",
      "—"
    );

  }


  if (
    calculatedPropellerSpeed !== null
  ) {

    setText(
      "speedPropellerSpeed",
      calculatedPropellerSpeed.toFixed(2) +
      " Knots"
    );

  }
  else {

    setText(
      "speedPropellerSpeed",
      "—"
    );

  }

}


/* =========================================================
   SPEED & SLIP
   ========================================================= */

function calculateSpeedSlip() {

  setError("speedSlipError", "");


  if (
    isBlank("logDistance") ||
    isBlank("ogDistance")
  ) {

    setError(
      "speedSlipError",
      "Please enter both LOG Distance and OG Distance."
    );

    return;

  }


  if (
    calculatedPropellerDistance === null ||
    calculatedPropellerSpeed === null
  ) {

    setError(
      "speedSlipError",
      "Calculate the Propeller section first."
    );

    return;

  }


  if (isBlank("runningTime")) {

    setError(
      "speedSlipError",
      "Running Time is required."
    );

    return;

  }


  const logDistanceValue =
    numberValue("logDistance");

  const ogDistanceValue =
    numberValue("ogDistance");

  const time =
    numberValue("runningTime");


  if (
    !Number.isFinite(logDistanceValue) ||
    !Number.isFinite(ogDistanceValue) ||
    !Number.isFinite(time)
  ) {

    setError(
      "speedSlipError",
      "Please enter valid numerical values."
    );

    return;

  }


  if (
    logDistanceValue < 0 ||
    ogDistanceValue < 0
  ) {

    setError(
      "speedSlipError",
      "Distances cannot be negative."
    );

    return;

  }


  if (time <= 0) {

    setError(
      "speedSlipError",
      "Running Time must be greater than zero."
    );

    return;

  }


  /* =====================================================
     SPEED
     ===================================================== */

  const logSpeedValue =
    logDistanceValue / time;


  const ogSpeedValue =
    ogDistanceValue / time;


  /* =====================================================
     SLIP BY DISTANCE
     ===================================================== */

  const slipLogDistanceValue =
    (
      (
        calculatedPropellerDistance -
        logDistanceValue
      ) /
      calculatedPropellerDistance
    ) * 100;


  const slipOgDistanceValue =
    (
      (
        calculatedPropellerDistance -
        ogDistanceValue
      ) /
      calculatedPropellerDistance
    ) * 100;


  /* =====================================================
     SLIP BY SPEED
     ===================================================== */

  const slipLogSpeedValue =
    (
      (
        calculatedPropellerSpeed -
        logSpeedValue
      ) /
      calculatedPropellerSpeed
    ) * 100;


  const slipOgSpeedValue =
    (
      (
        calculatedPropellerSpeed -
        ogSpeedValue
      ) /
      calculatedPropellerSpeed
    ) * 100;


  /* =====================================================
     DISPLAY SPEED
     ===================================================== */

  setText(
    "logSpeed",
    logSpeedValue.toFixed(2)
  );


  setText(
    "ogSpeed",
    ogSpeedValue.toFixed(2)
  );


  setText(
    "speedPropellerSpeedOutput",
    calculatedPropellerSpeed.toFixed(2)
  );


  /* =====================================================
     DISPLAY SLIP BY DISTANCE
     ===================================================== */

  setText(
    "slipLogDistance",
    slipLogDistanceValue.toFixed(2)
  );


  setText(
    "slipOgDistance",
    slipOgDistanceValue.toFixed(2)
  );


  /* =====================================================
     DISPLAY SLIP BY SPEED
     ===================================================== */

  setText(
    "slipLogSpeed",
    slipLogSpeedValue.toFixed(2)
  );


  setText(
    "slipOgSpeed",
    slipOgSpeedValue.toFixed(2)
  );

}


/* =========================================================
   CONSTANT MODE UI
   ========================================================= */

document
  .querySelectorAll(
    'input[name="constantMode"]'
  )
  .forEach(function(radio) {

    radio.addEventListener(
      "change",
      function() {

        const manualContainer =
          document.getElementById(
            "manualConstantContainer"
          );


        if (this.value === "manual") {

          manualContainer.classList.remove(
            "hidden"
          );

        }

        else {

          manualContainer.classList.add(
            "hidden"
          );

        }

      }
    );

  });


/* =========================================================
   DISTANCE MODE UI
   ========================================================= */

document
  .querySelectorAll(
    'input[name="distanceMode"]'
  )
  .forEach(function(radio) {

    radio.addEventListener(
      "change",
      function() {

        const manualContainer =
          document.getElementById(
            "manualDistanceContainer"
          );


        if (this.value === "manual") {

          manualContainer.classList.remove(
            "hidden"
          );

        }

        else {

          manualContainer.classList.add(
            "hidden"
          );

        }

      }
    );

  });


/* =========================================================
   BUTTONS
   ========================================================= */

document
  .getElementById("calculateRpmButton")
  .addEventListener(
    "click",
    calculateRPM
  );


document
  .getElementById("calculatePropellerButton")
  .addEventListener(
    "click",
    calculatePropeller
  );


document
  .getElementById("calculateSpeedSlipButton")
  .addEventListener(
    "click",
    calculateSpeedSlip
  );


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key !== "Enter"
    ) {

      return;

    }


    const active =
      document.activeElement;


    if (
      active.id === "counterPrevious" ||
      active.id === "counterPresent" ||
      active.id === "runningTime"
    ) {

      calculateRPM();

    }


    else if (
      active.id === "propellerPitch" ||
      active.id === "manualConstantRev" ||
      active.id === "manualPropellerDistance"
    ) {

      calculatePropeller();

    }


    else if (
      active.id === "logDistance" ||
      active.id === "ogDistance"
    ) {

      calculateSpeedSlip();

    }

  }
);