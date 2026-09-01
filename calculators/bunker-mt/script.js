/* =========================================================
   MARINECALC
   BUNKER (MT) CALCULATOR
   OFFLINE-SAFE VERSION
   ========================================================= */


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
   BASIC ELEMENT CHECK
   ========================================================= */

console.log(
  "MarineCalc: Bunker elements loaded."
);


/* =========================================================
   ERROR FUNCTIONS
   ========================================================= */

function showError(message) {

  if (errorMessage) {

    errorMessage.textContent =
      message;

  }

}


function clearError() {

  if (errorMessage) {

    errorMessage.textContent =
      "";

  }

}


/* =========================================================
   CALCULATE BUNKER MASS
   ========================================================= */

function calculateBunkerMass() {

  console.log(
    "MarineCalc: calculateBunkerMass() started."
  );


  clearError();


  /* =====================================================
     CHECK ELEMENTS
     ===================================================== */

  if (
    !actualVolume ||
    !density15 ||
    !temperature ||
    !coefficient
  ) {

    showError(
      "Calculator elements could not be found."
    );

    console.error(
      "MarineCalc: Calculator HTML elements missing."
    );

    return;

  }


  /* =====================================================
     REQUIRED FIELDS
     ===================================================== */

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


  /* =====================================================
     CONVERT INPUTS
     ===================================================== */

  const volume =
    Number(
      actualVolume.value
    );

  const density =
    Number(
      density15.value
    );

  const temp =
    Number(
      temperature.value
    );

  const correction =
    Number(
      coefficient.value
    );


  /* =====================================================
     VALIDATE VOLUME
     ===================================================== */

  if (
    !Number.isFinite(volume) ||
    volume <= 0
  ) {

    showError(
      "Actual Volume must be greater than zero."
    );

    return;

  }


  /* =====================================================
     VALIDATE DENSITY
     ===================================================== */

  if (
    !Number.isFinite(density) ||
    density <= 0
  ) {

    showError(
      "Density @ 15°C must be greater than zero."
    );

    return;

  }


  /* =====================================================
     VALIDATE TEMPERATURE
     ===================================================== */

  if (
    !Number.isFinite(temp)
  ) {

    showError(
      "Please enter a valid fuel temperature."
    );

    return;

  }


  /* =====================================================
     VALIDATE COEFFICIENT
     ===================================================== */

  if (
    !Number.isFinite(correction) ||
    correction < 0
  ) {

    showError(
      "Correction Coefficient must be zero or greater."
    );

    return;

  }


  /* =====================================================
     TEMPERATURE-CORRECTED DENSITY

     Density ×
     [1 − {(T − 15) × C}]
     ===================================================== */

  const corrected =
    density *
    (
      1 -
      (
        (temp - 15) *
        correction
      )
    );


  /* =====================================================
     VALIDATE CORRECTED DENSITY
     ===================================================== */

  if (
    !Number.isFinite(corrected) ||
    corrected <= 0
  ) {

    showError(
      "The calculated density is not valid. Check the inputs and coefficient."
    );

    return;

  }


  /* =====================================================
     BUNKER MASS

     Actual Volume × Corrected Density ÷ 1000
     ===================================================== */

  const massMT =
    volume *
    corrected /
    1000;


  /* =====================================================
     DISPLAY RESULTS
     ===================================================== */

  if (correctedDensity) {

    correctedDensity.textContent =
      corrected.toFixed(4);

  }


  if (bunkerMass) {

    bunkerMass.textContent =
      massMT.toFixed(4);

  }


  /* =====================================================
     AUDIT TRAIL
     ===================================================== */

  if (auditDensity) {

    auditDensity.textContent =
      density.toFixed(1) +
      " kg/m³";

  }


  if (auditTemperature) {

    auditTemperature.textContent =
      temp.toFixed(2) +
      " °C";

  }


  if (auditCoefficient) {

    auditCoefficient.textContent =
      correction;

  }


  if (auditVolume) {

    auditVolume.textContent =
      volume.toFixed(2) +
      " m³";

  }


  if (auditTcdCalculation) {

    auditTcdCalculation.textContent =
      density.toFixed(1) +
      " × [1 − {(" +
      temp.toFixed(2) +
      " − 15) × " +
      correction +
      "}]";

  }


  if (auditTcdResult) {

    auditTcdResult.textContent =
      corrected.toFixed(4);

  }


  if (auditMassCalculation) {

    auditMassCalculation.textContent =
      volume.toFixed(2) +
      " × " +
      corrected.toFixed(4) +
      " ÷ 1000";

  }


  if (auditMassResult) {

    auditMassResult.textContent =
      massMT.toFixed(4);

  }


  console.log(
    "MarineCalc: Calculation successful.",
    {
      volume: volume,
      density15: density,
      temperature: temp,
      coefficient: correction,
      correctedDensity: corrected,
      bunkerMass: massMT
    }
  );

}


/* =========================================================
   MAKE CALCULATOR FUNCTION AVAILABLE
   =========================================================

   IMPORTANT:
   This is intentionally assigned to window.

   That means the function can be checked from
   the browser console with:

   typeof calculateBunkerMass

   and should return:

   "function"
   ========================================================= */

window.calculateBunkerMass =
  calculateBunkerMass;


/* =========================================================
   CLEAR CALCULATOR
   ========================================================= */

function clearCalculator() {

  if (actualVolume) {

    actualVolume.value =
      "";

  }

  if (density15) {

    density15.value =
      "";

  }

  if (temperature) {

    temperature.value =
      "";

  }

  if (coefficient) {

    coefficient.value =
      "0.00064";

  }


  if (correctedDensity) {

    correctedDensity.textContent =
      "—";

  }

  if (bunkerMass) {

    bunkerMass.textContent =
      "—";

  }


  if (auditDensity) {

    auditDensity.textContent =
      "—";

  }

  if (auditTemperature) {

    auditTemperature.textContent =
      "—";

  }

  if (auditCoefficient) {

    auditCoefficient.textContent =
      "—";

  }

  if (auditVolume) {

    auditVolume.textContent =
      "—";

  }

  if (auditTcdCalculation) {

    auditTcdCalculation.textContent =
      "—";

  }

  if (auditTcdResult) {

    auditTcdResult.textContent =
      "—";

  }

  if (auditMassCalculation) {

    auditMassCalculation.textContent =
      "—";

  }

  if (auditMassResult) {

    auditMassResult.textContent =
      "—";

  }


  clearError();


  console.log(
    "MarineCalc: Calculator cleared."
  );

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

if (calculateButton) {

  calculateButton.addEventListener(
    "click",
    calculateBunkerMass
  );

}


if (clearButton) {

  clearButton.addEventListener(
    "click",
    clearCalculator
  );

}


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


/* =========================================================
   SUPABASE / PRO SYSTEM
   =========================================================

   IMPORTANT:

   Supabase is OPTIONAL here.

   The calculator MUST NOT stop working
   just because Supabase is unavailable.
   ========================================================= */

let supabaseClient = null;


const SUPABASE_URL =
  "https://lasdhuckmemuukiqovyw.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_39hL-GbiMsBs2zuJmGM6cg_g34fj8s6";


function initializeSupabase() {

  try {

    if (
      typeof window.supabase ===
      "undefined"
    ) {

      console.warn(
        "MarineCalc: Supabase library unavailable. Calculator will continue working offline."
      );

      return false;

    }


    if (
      typeof window.supabase.createClient !==
      "function"
    ) {

      console.warn(
        "MarineCalc: Supabase createClient unavailable."
      );

      return false;

    }


    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );


    console.log(
      "MarineCalc: Supabase initialized."
    );


    return true;

  } catch (error) {

    console.warn(
      "MarineCalc: Supabase initialization failed. Calculator will continue working.",
      error
    );

    supabaseClient =
      null;

    return false;

  }

}


/* =========================================================
   OFFLINE PRO HELPERS
   ========================================================= */

function getOfflineProAccess() {

  try {

    const raw =
      localStorage.getItem(
        "marinecalc_offline_pro"
      );


    if (!raw) {

      return null;

    }


    return JSON.parse(raw);

  } catch (error) {

    console.warn(
      "MarineCalc: Could not read offline PRO authorization.",
      error
    );

    return null;

  }

}


function hasValidOfflineProAccess(
  userId = null
) {

  const authorization =
    getOfflineProAccess();


  if (!authorization) {

    return false;

  }


  if (
    userId &&
    authorization.userId &&
    authorization.userId !== userId
  ) {

    return false;

  }


  if (
    authorization.expiresAt
  ) {

    const expiry =
      new Date(
        authorization.expiresAt
      ).getTime();


    if (
      !Number.isFinite(expiry) ||
      Date.now() >= expiry
    ) {

      return false;

    }

  }


  return true;

}


/* =========================================================
   SAVE OFFLINE PRO ACCESS
   ========================================================= */

function saveOfflineProAccess(
  user,
  expiresAt
) {

  try {

    const authorization = {

      userId:
        user?.id || null,

      email:
        user?.email || null,

      expiresAt:
        expiresAt || null,

      verifiedAt:
        new Date().toISOString()

    };


    localStorage.setItem(
      "marinecalc_offline_pro",
      JSON.stringify(
        authorization
      )
    );


    return true;

  } catch (error) {

    console.warn(
      "MarineCalc: Could not save offline PRO authorization.",
      error
    );

    return false;

  }

}


/* =========================================================
   CLEAR OFFLINE PRO
   ========================================================= */

function clearOfflineProAccess() {

  try {

    localStorage.removeItem(
      "marinecalc_offline_pro"
    );

  } catch (error) {

    console.warn(
      "MarineCalc: Could not clear offline PRO authorization.",
      error
    );

  }

}


/* =========================================================
   OFFLINE PRO STATUS
   ========================================================= */

function getOfflineProStatus() {

  const authorization =
    getOfflineProAccess();


  return {

    active:
      hasValidOfflineProAccess(),

    authorization:
      authorization

  };

}


window.getOfflineProStatus =
  getOfflineProStatus;


/* =========================================================
   OFFLINE PRO BANNER
   ========================================================= */

function showOfflineProMode() {

  if (
    document.getElementById(
      "marinecalcOfflineProBanner"
    )
  ) {

    return;

  }


  const banner =
    document.createElement("div");


  banner.id =
    "marinecalcOfflineProBanner";


  banner.style.cssText = `
    margin-bottom:20px;
    padding:16px 17px;
    border:1px solid #B9D3DF;
    border-radius:10px;
    background:#EAF4F8;
  `;


  banner.innerHTML = `

    <strong
      style="
        display:block;
        margin-bottom:6px;
        color:#003B5C;
        font-size:12px;
        font-weight:900;
      "
    >
      🟡 OFFLINE MODE — PRO VERIFIED
    </strong>

    <p
      style="
        margin:0;
        color:#496474;
        font-size:10px;
        line-height:1.55;
      "
    >
      MarineCalc PRO access was previously verified
      online. You can continue using this calculator
      while offline.
    </p>

  `;


  const card =
    document.querySelector(
      ".calculator-card"
    );


  if (card) {

    card.prepend(
      banner
    );

  }

}


/* =========================================================
   PRO PREVIEW
   ========================================================= */

const PREVIEW_DATA = {

  volume:
    "2044.33",

  density:
    "924.7",

  temperature:
    "45",

  coefficient:
    "0.00064"

};


function showProPreview() {

  if (
    document.getElementById(
      "marinecalcPreviewBanner"
    )
  ) {

    return;

  }


  const card =
    document.querySelector(
      ".calculator-card"
    );


  if (!card) {

    return;

  }


  /*
     Disable controls.
  */

  card
    .querySelectorAll(
      "input, button"
    )
    .forEach(
      element => {

        element.disabled =
          true;

        element.style.opacity =
          "0.82";

      }
    );


  /*
     Banner.
  */

  const banner =
    document.createElement("div");


  banner.id =
    "marinecalcPreviewBanner";


  banner.style.cssText = `
    margin-bottom:20px;
    padding:16px 17px;
    border:1px solid #B9D3DF;
    border-radius:10px;
    background:#EAF4F8;
  `;


  banner.innerHTML = `

    <strong
      style="
        display:block;
        margin-bottom:6px;
        color:#003B5C;
        font-size:12px;
        font-weight:900;
      "
    >
      🔒 MARINECALC PRO PREVIEW
    </strong>

    <p
      style="
        margin:0 0 13px;
        color:#496474;
        font-size:10px;
        line-height:1.55;
      "
    >
      You're viewing a working demonstration of the
      Bunker (MT) Calculator. Sample data is shown for
      demonstration only. An active PRO subscription
      is required to enter your own vessel and fuel data.
    </p>

    <div
      style="
        display:flex;
        gap:8px;
        flex-wrap:wrap;
      "
    >

      <a
        href="../../pro/index.html"
        style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:36px;
          padding:0 14px;
          border-radius:6px;
          background:#176C8E;
          color:#FFFFFF;
          text-decoration:none;
          font-size:10px;
          font-weight:800;
        "
      >
        GET PRO — $9 / 1 YEAR
      </a>

      <a
        href="../../auth/index.html"
        style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:36px;
          padding:0 14px;
          border-radius:6px;
          border:1px solid #176C8E;
          background:#FFFFFF;
          color:#176C8E;
          text-decoration:none;
          font-size:10px;
          font-weight:800;
        "
      >
        LOGIN / MY ACCOUNT
      </a>

    </div>

  `;


  card.prepend(
    banner
  );


  /*
     Load preview values.
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
     IMPORTANT:

     Calculate directly.

     Do NOT depend on Supabase.
  */

  calculateBunkerMass();

}


/* =========================================================
   PRO ACCESS CHECK
   ========================================================= */

async function checkProAccess() {

  /*
     If Supabase isn't available,
     check offline authorization only.
  */

  if (!supabaseClient) {

    if (
      hasValidOfflineProAccess()
    ) {

      showOfflineProMode();

    } else {

      showProPreview();

    }

    return;

  }


  try {

    const {
      data: sessionData,
      error: sessionError
    } =
      await supabaseClient
        .auth
        .getSession();


    if (sessionError) {

      console.warn(
        "MarineCalc: Session check failed.",
        sessionError
      );


      if (
        hasValidOfflineProAccess()
      ) {

        showOfflineProMode();

      } else {

        showProPreview();

      }

      return;

    }


    const session =
      sessionData?.session;


    const user =
      session?.user;


    if (!user) {

      showProPreview();

      return;

    }


    const {
      data: isPro,
      error: proError
    } =
      await supabaseClient
        .rpc("is_pro");


    if (proError) {

      console.warn(
        "MarineCalc: Online PRO check failed.",
        proError
      );


      if (
        hasValidOfflineProAccess(
          user.id
        )
      ) {

        showOfflineProMode();

      } else {

        showProPreview();

      }

      return;

    }


    if (!isPro) {

      clearOfflineProAccess();

      showProPreview();

      return;

    }


    /*
       User is PRO.

       Try to obtain subscription expiry.
    */

    const {
      data: subscription,
      error: subscriptionError
    } =
      await supabaseClient
        .from("pro_subscriptions")
        .select("expires_at")
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "status",
          "active"
        )
        .order(
          "expires_at",
          {
            ascending:false
          }
        )
        .limit(1)
        .maybeSingle();


    if (
      !subscriptionError &&
      subscription?.expires_at
    ) {

      saveOfflineProAccess(
        user,
        subscription.expires_at
      );

    }


    console.log(
      "MarineCalc PRO access confirmed."
    );


  } catch (error) {

    console.warn(
      "MarineCalc: PRO verification failed.",
      error
    );


    if (
      hasValidOfflineProAccess()
    ) {

      showOfflineProMode();

    } else {

      showProPreview();

    }

  }

}


/* =========================================================
   INITIALIZE SUPABASE SAFELY
   ========================================================= */

initializeSupabase();


/* =========================================================
   START PRO CHECK AFTER CALCULATOR IS READY
   ========================================================= */

setTimeout(
  function () {

    checkProAccess();

  },
  0
);


/* =========================================================
   FINAL LOADED MESSAGE
   ========================================================= */

console.log(
  "MarineCalc Bunker (MT) Calculator loaded successfully."
);