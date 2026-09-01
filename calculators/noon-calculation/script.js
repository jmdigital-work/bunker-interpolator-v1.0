/* =========================================================
   MARINECALC PRO ACCESS CONTROL
   NOON CALCULATION
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
   PRO ACCESS
   ========================================================= */

function showProLock() {

  /*
    Disable all calculator controls.
  */

  document
    .querySelectorAll(
      ".calculator-card input, .calculator-card button"
    )
    .forEach((element) => {

      element.disabled = true;

    });


  /*
    Create PRO lock message.
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


  /*
    Put the lock message above
    the first calculator section.
  */

  const firstCalculator =
    document.querySelector(
      ".calculator-card"
    );


  if (firstCalculator) {

    firstCalculator.parentNode.insertBefore(
      lockMessage,
      firstCalculator
    );

  }

}


/* =========================================================
   CHECK PRO SUBSCRIPTION
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


    if (sessionError) {

      console.error(
        "Session error:",
        sessionError
      );

      showProLock();

      return;

    }


    /*
      No authenticated session.
    */

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


    /*
      User is authenticated but does
      not have an active PRO subscription.
    */

    if (!isPro) {

      showProLock();

      return;

    }


    /*
      Valid PRO subscription confirmed.
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
   NOON CALCULATION
   ========================================================= */

let calculatedTotalRevolution = null;
let calculatedAverageRpm = null;

let calculatedConstantRev = null;

let selectedConstantRev = null;
let calculatedConstantRpm = null;
let calculatedPropellerDistance = null;
let calculatedPropellerSpeed = null;


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function numberValue(id) {
  return Number(document.getElementById(id).value);
}


function isBlank(id) {
  return document.getElementById(id).value.trim() === "";
}


function setText(id, value) {
  document.getElementById(id).textContent = value;
}


function setError(id, message) {
  document.getElementById(id).textContent = message;
}


function format(value, decimals) {
  return Number(value).toFixed(decimals);
}


/* =========================================================
   1. MAIN ENGINE RPM
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
      "Please enter all Main Engine RPM inputs."
    );

    return;
  }


  const previous = numberValue("counterPrevious");
  const present = numberValue("counterPresent");
  const time = numberValue("runningTime");


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
      "Ship Running Time must be greater than zero."
    );

    return;
  }


  calculatedTotalRevolution = present - previous;

  calculatedAverageRpm =
    calculatedTotalRevolution / (time * 60);


  setText(
    "totalRevolution",
    calculatedTotalRevolution.toFixed(0)
  );


  setText(
    "averageRpm",
    calculatedAverageRpm.toFixed(2)
  );


  updateCarriedValues();


  document.getElementById("rpmAudit").innerHTML = `

    <div class="audit-step">

      <span>
        M/E Total Revolution
      </span>

      <code>
        Present RC − Previous RC
      </code>

      <strong>
        ${format(present, 0)}
        −
        ${format(previous, 0)}
        =
        ${format(calculatedTotalRevolution, 0)}
        rev
      </strong>

    </div>


    <div class="audit-step">

      <span>
        M/E RPM
      </span>

      <code>
        M/E Total Revolution ÷ (Running Time × 60)
      </code>

      <strong>
        ${format(calculatedTotalRevolution, 0)}
        ÷
        (${format(time, 2)} × 60)
        =
        ${format(calculatedAverageRpm, 2)}
        RPM
      </strong>

    </div>

  `;
}


/* =========================================================
   2. PROPELLER CONSTANT
   ========================================================= */

function calculateConstant() {

  setError("constantError", "");


  if (isBlank("propellerPitch")) {

    setError(
      "constantError",
      "Enter Propeller Pitch to calculate ConstantREV."
    );

    return;
  }


  const pitchMm = numberValue("propellerPitch");


  if (
    !Number.isFinite(pitchMm) ||
    pitchMm <= 0
  ) {

    setError(
      "constantError",
      "Propeller Pitch must be greater than zero."
    );

    return;
  }


  const pitchMeters = pitchMm / 1000;


  calculatedConstantRev =
    pitchMeters / 1852;


  setText(
    "calculatedConstantRev",
    calculatedConstantRev.toFixed(10)
  );


  updateCarriedValues();


  document.getElementById("constantAudit").innerHTML = `

    <div class="audit-step">

      <span>
        Convert pitch from mm to m
      </span>

      <code>
        Pitch (mm) ÷ 1000
      </code>

      <strong>
        ${format(pitchMm, 3)}
        ÷ 1000
        =
        ${format(pitchMeters, 6)}
        m
      </strong>

    </div>


    <div class="audit-step">

      <span>
        Propeller ConstantREV
      </span>

      <code>
        Pitch (m) ÷ 1852
      </code>

      <strong>
        ${format(pitchMeters, 6)}
        ÷ 1852
        =
        ${format(calculatedConstantRev, 10)}
        Nm/rev
      </strong>

    </div>

  `;
}


/* =========================================================
   CONSTANT SOURCE
   ========================================================= */

function getConstantSource() {

  return document.querySelector(
    'input[name="constantSource"]:checked'
  ).value;

}


function getSpeedDistanceSource() {

  return document.querySelector(
    'input[name="speedDistanceSource"]:checked'
  ).value;

}


function getSelectedConstant() {

  const source = getConstantSource();


  /*
     USE CALCULATED CONSTANT
  */

  if (source === "calculated") {

    if (calculatedConstantRev === null) {

      setError(
        "propellerError",
        "Calculate the Propeller Constant first."
      );

      return null;
    }

    return calculatedConstantRev;
  }


  /*
     USE EXISTING CONSTANT
  */

  if (isBlank("existingConstantRev")) {

    setError(
      "propellerError",
      "Enter the existing Propeller ConstantREV."
    );

    return null;
  }


  const existing =
    numberValue("existingConstantRev");


  if (
    !Number.isFinite(existing) ||
    existing <= 0
  ) {

    setError(
      "propellerError",
      "Existing Propeller ConstantREV must be greater than zero."
    );

    return null;
  }


  return existing;
}


/* =========================================================
   3. PROPELLER DISTANCE & SPEED
   ========================================================= */

function calculatePropeller() {

  setError("propellerError", "");


  if (
    calculatedTotalRevolution === null ||
    calculatedAverageRpm === null
  ) {

    setError(
      "propellerError",
      "Calculate Main Engine RPM first."
    );

    return;
  }


  const constantRev =
    getSelectedConstant();


  if (constantRev === null) {
    return;
  }


  /*
     ConstantREV → ConstantRPM
  */

  const constantRpm =
    constantRev * 60;


  /*
     Propeller Distance
  */

  const distance =
    constantRev *
    calculatedTotalRevolution;


  /*
     Propeller Speed
  */

  const speed =
    constantRpm *
    calculatedAverageRpm;


  selectedConstantRev =
    constantRev;

  calculatedConstantRpm =
    constantRpm;

  calculatedPropellerDistance =
    distance;

  calculatedPropellerSpeed =
    speed;


  /*
     DISPLAY RESULTS
  */

  setText(
    "selectedConstantRev",
    constantRev.toFixed(10)
  );


  setText(
    "constantRev",
    constantRev.toFixed(10)
  );


  setText(
    "constantRpm",
    constantRpm.toFixed(10)
  );


  setText(
    "propellerDistance",
    distance.toFixed(2)
  );


  setText(
    "propellerSpeed",
    speed.toFixed(2)
  );


  updateCarriedValues();


  const sourceText =
    getConstantSource() === "existing"
      ? "Existing ConstantREV entered by user"
      : "Calculated ConstantREV from Propeller Constant section";


  /*
     AUDIT TRAIL
  */

  document.getElementById("propellerAudit").innerHTML = `

    <div class="audit-step">

      <span>
        ConstantREV source
      </span>

      <strong>
        ${sourceText}
      </strong>

    </div>


    <div class="audit-step">

      <span>
        Selected ConstantREV
      </span>

      <strong>
        ${format(constantRev, 10)}
        Nm/rev
      </strong>

    </div>


    <div class="audit-step">

      <span>
        ConstantRPM
      </span>

      <code>
        ConstantREV × 60
      </code>

      <strong>
        ${format(constantRev, 10)}
        × 60
        =
        ${format(constantRpm, 10)}
      </strong>

    </div>


    <div class="audit-step">

      <span>
        Propeller Distance
      </span>

      <code>
        ConstantREV × M/E Total Revolution
      </code>

      <strong>
        ${format(constantRev, 10)}
        ×
        ${format(calculatedTotalRevolution, 0)}
        =
        ${format(distance, 2)}
        Nm
      </strong>

    </div>


    <div class="audit-step">

      <span>
        Propeller Speed
      </span>

      <code>
        ConstantRPM × M/E RPM
      </code>

      <strong>
        ${format(constantRpm, 10)}
        ×
        ${format(calculatedAverageRpm, 2)}
        =
        ${format(speed, 2)}
        Knots
      </strong>

    </div>

  `;
}


/* =========================================================
   CARRIED VALUES
   ========================================================= */

function updateCarriedValues() {

  if (calculatedTotalRevolution !== null) {

    setText(
      "propTotalRevolution",
      `${calculatedTotalRevolution.toFixed(0)} rev`
    );

  } else {

    setText(
      "propTotalRevolution",
      "—"
    );

  }


  if (calculatedAverageRpm !== null) {

    setText(
      "propAverageRpm",
      `${calculatedAverageRpm.toFixed(2)} RPM`
    );

  } else {

    setText(
      "propAverageRpm",
      "—"
    );

  }


  if (selectedConstantRev !== null) {

    setText(
      "selectedConstantRev",
      selectedConstantRev.toFixed(10)
    );

  } else {

    setText(
      "selectedConstantRev",
      "—"
    );

  }


  if (calculatedPropellerDistance !== null) {

    setText(
      "speedPropellerDistance",
      `${calculatedPropellerDistance.toFixed(2)} Nm`
    );

  } else {

    setText(
      "speedPropellerDistance",
      "—"
    );

  }


  if (calculatedPropellerSpeed !== null) {

    setText(
      "speedPropellerSpeed",
      `${calculatedPropellerSpeed.toFixed(2)} Knots`
    );

  } else {

    setText(
      "speedPropellerSpeed",
      "—"
    );

  }

}


/* =========================================================
   4. LOG/OG SPEED & SLIP
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


  if (calculatedPropellerSpeed === null) {

    setError(
      "speedSlipError",
      "Calculate the Propeller section first."
    );

    return;
  }


  if (isBlank("runningTime")) {

    setError(
      "speedSlipError",
      "Ship Running Time is required."
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
      "Ship Running Time must be greater than zero."
    );

    return;
  }


  let propellerDistanceForSlip;


  /*
     CALCULATED OR MANUAL PROPELLER DISTANCE
  */

  if (getSpeedDistanceSource() === "manual") {

    if (
      isBlank(
        "manualSpeedPropellerDistance"
      )
    ) {

      setError(
        "speedSlipError",
        "Enter the manual Propeller Distance."
      );

      return;
    }


    propellerDistanceForSlip =
      numberValue(
        "manualSpeedPropellerDistance"
      );


    if (
      !Number.isFinite(
        propellerDistanceForSlip
      ) ||
      propellerDistanceForSlip <= 0
    ) {

      setError(
        "speedSlipError",
        "Manual Propeller Distance must be greater than zero."
      );

      return;
    }


    setText(
      "speedPropellerDistance",
      `${propellerDistanceForSlip.toFixed(2)} Nm`
    );


    document.getElementById(
      "speedDistanceSourceNote"
    ).textContent =
      "manually entered by user";

  } else {

    if (
      calculatedPropellerDistance === null
    ) {

      setError(
        "speedSlipError",
        "Calculate the Propeller section first."
      );

      return;
    }


    propellerDistanceForSlip =
      calculatedPropellerDistance;


    setText(
      "speedPropellerDistance",
      `${propellerDistanceForSlip.toFixed(2)} Nm`
    );


    document.getElementById(
      "speedDistanceSourceNote"
    ).textContent =
      "from Propeller calculation";

  }


  /*
     LOG / OG SPEED
  */

  const logSpeedValue =
    logDistanceValue / time;

  const ogSpeedValue =
    ogDistanceValue / time;


  /*
     SLIP BY DISTANCE
  */

  const slipLogDistanceValue =
    (
      (
        propellerDistanceForSlip -
        logDistanceValue
      ) /
      propellerDistanceForSlip
    ) * 100;


  const slipOgDistanceValue =
    (
      (
        propellerDistanceForSlip -
        ogDistanceValue
      ) /
      propellerDistanceForSlip
    ) * 100;


  /*
     SLIP BY SPEED
  */

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


  /*
     DISPLAY SPEED RESULTS
  */

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


  /*
     DISPLAY SLIP RESULTS
  */

  setText(
    "slipLogDistance",
    slipLogDistanceValue.toFixed(2)
  );


  setText(
    "slipOgDistance",
    slipOgDistanceValue.toFixed(2)
  );


  setText(
    "slipLogSpeed",
    slipLogSpeedValue.toFixed(2)
  );


  setText(
    "slipOgSpeed",
    slipOgSpeedValue.toFixed(2)
  );


  const distanceSourceText =
    getSpeedDistanceSource() === "manual"
      ? "Manual Propeller Distance"
      : "Calculated Propeller Distance";


  /*
     AUDIT TRAIL
  */

  document.getElementById(
    "speedSlipAudit"
  ).innerHTML = `

    <div class="audit-step">

      <span>
        Propeller Distance source
      </span>

      <strong>
        ${distanceSourceText}
      </strong>

    </div>


    <div class="audit-step">

      <span>
        LOG Speed
      </span>

      <code>
        LOG Distance ÷ Running Time
      </code>

      <strong>
        ${format(logDistanceValue, 2)}
        ÷
        ${format(time, 2)}
        =
        ${format(logSpeedValue, 2)}
        Knots
      </strong>

    </div>


    <div class="audit-step">

      <span>
        OG Speed
      </span>

      <code>
        OG Distance ÷ Running Time
      </code>

      <strong>
        ${format(ogDistanceValue, 2)}
        ÷
        ${format(time, 2)}
        =
        ${format(ogSpeedValue, 2)}
        Knots
      </strong>

    </div>


    <div class="audit-step">

      <span>
        SLIP (LOG Distance)
      </span>

      <code>
        (Propeller Distance − LOG Distance) ÷ Propeller Distance × 100
      </code>

      <strong>
        (
        ${format(propellerDistanceForSlip, 2)}
        −
        ${format(logDistanceValue, 2)}
        )
        ÷
        ${format(propellerDistanceForSlip, 2)}
        × 100
        =
        ${format(slipLogDistanceValue, 2)}
        %
      </strong>

    </div>


    <div class="audit-step">

      <span>
        SLIP (OG Distance)
      </span>

      <code>
        (Propeller Distance − OG Distance) ÷ Propeller Distance × 100
      </code>

      <strong>
        (
        ${format(propellerDistanceForSlip, 2)}
        −
        ${format(ogDistanceValue, 2)}
        )
        ÷
        ${format(propellerDistanceForSlip, 2)}
        × 100
        =
        ${format(slipOgDistanceValue, 2)}
        %
      </strong>

    </div>


    <div class="audit-step">

      <span>
        SLIP (LOG Speed)
      </span>

      <code>
        (Propeller Speed − LOG Speed) ÷ Propeller Speed × 100
      </code>

      <strong>
        (
        ${format(calculatedPropellerSpeed, 2)}
        −
        ${format(logSpeedValue, 2)}
        )
        ÷
        ${format(calculatedPropellerSpeed, 2)}
        × 100
        =
        ${format(slipLogSpeedValue, 2)}
        %
      </strong>

    </div>


    <div class="audit-step">

      <span>
        SLIP (OG Speed)
      </span>

      <code>
        (Propeller Speed − OG Speed) ÷ Propeller Speed × 100
      </code>

      <strong>
        (
        ${format(calculatedPropellerSpeed, 2)}
        −
        ${format(ogSpeedValue, 2)}
        )
        ÷
        ${format(calculatedPropellerSpeed, 2)}
        × 100
        =
        ${format(slipOgSpeedValue, 2)}
        %
      </strong>

    </div>

  `;
}


/* =========================================================
   UI — CONSTANT SOURCE
   ========================================================= */

document
  .querySelectorAll(
    'input[name="constantSource"]'
  )
  .forEach((radio) => {

    radio.addEventListener(
      "change",
      function () {

        document
          .getElementById(
            "existingConstantContainer"
          )
          .classList.toggle(
            "hidden",
            this.value !== "existing"
          );

      }
    );

  });


/* =========================================================
   UI — SPEED/SLIP DISTANCE SOURCE
   ========================================================= */

document
  .querySelectorAll(
    'input[name="speedDistanceSource"]'
  )
  .forEach((radio) => {

    radio.addEventListener(
      "change",
      function () {

        document
          .getElementById(
            "manualSpeedDistanceContainer"
          )
          .classList.toggle(
            "hidden",
            this.value !== "manual"
          );

      }
    );

  });


/* =========================================================
   BUTTONS
   ========================================================= */

document
  .getElementById(
    "calculateRpmButton"
  )
  .addEventListener(
    "click",
    calculateRPM
  );


document
  .getElementById(
    "calculateConstantButton"
  )
  .addEventListener(
    "click",
    calculateConstant
  );


document
  .getElementById(
    "calculatePropellerButton"
  )
  .addEventListener(
    "click",
    calculatePropeller
  );


document
  .getElementById(
    "calculateSpeedSlipButton"
  )
  .addEventListener(
    "click",
    calculateSpeedSlip
  );


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Enter") {
      return;
    }


    const active =
      document.activeElement;


    if (
      [
        "counterPrevious",
        "counterPresent",
        "runningTime"
      ].includes(active.id)
    ) {

      calculateRPM();

    } else if (
      active.id === "propellerPitch"
    ) {

      calculateConstant();

    } else if (
      active.id === "existingConstantRev"
    ) {

      calculatePropeller();

    } else if (
      active.id ===
      "manualSpeedPropellerDistance" ||
      active.id === "logDistance" ||
      active.id === "ogDistance"
    ) {

      calculateSpeedSlip();

    }

  }
);