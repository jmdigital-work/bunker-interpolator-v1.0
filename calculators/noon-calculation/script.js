/* =========================================================
   MARINECALC PRO ACCESS CONTROL
   NOON CALCULATION
   PRO PREVIEW VERSION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
  "https://lasdhuckmemuukiqovy.supabase.co";

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
   PRO PREVIEW SAMPLE DATA
   ========================================================= */

const NOON_PREVIEW_DATA = {

  counterPrevious: "93310414",

  counterPresent: "93447666",

  runningTime: "24",

  propellerPitch: "3789.6",

  existingConstantRev: "0.0020462203",

  logDistance: "296",

  ogDistance: "269",

  manualSpeedPropellerDistance: "367.500"

};


/* =========================================================
   PRO PREVIEW STYLES
   ========================================================= */

function addPreviewStyles() {

  if (
    document.getElementById(
      "marinecalc-noon-preview-styles"
    )
  ) {

    return;

  }


  const style =
    document.createElement("style");


  style.id =
    "marinecalc-noon-preview-styles";


  style.textContent = `

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


    .marinecalc-preview-disabled {

      opacity:
        .82;

    }


    .marinecalc-offline-pro-banner {

      margin-bottom: 20px;

      padding: 14px 16px;

      border:
        1px solid
        #B9D3DF;

      border-radius: 10px;

      background:
        #EAF4F8;

    }


    .marinecalc-offline-pro-banner strong {

      display: block;

      margin-bottom: 6px;

      color:
        #003B5C;

      font-size: 12px;

      font-weight: 900;

      letter-spacing: .4px;

    }


    .marinecalc-offline-pro-banner p {

      margin:
        0;

      color:
        #496474;

      font-size: 10px;

      line-height: 1.55;

    }

  `;


  document.head.appendChild(style);

}


/* =========================================================
   SHOW PRO PREVIEW
   ========================================================= */

function showProPreview() {

  addPreviewStyles();


  if (
    document.getElementById(
      "marinecalcPreviewBanner"
    )
  ) {

    return;

  }


  document
    .querySelectorAll(
      ".calculator-card input, .calculator-card button"
    )
    .forEach(
      (element) => {

        element.disabled = true;

        element.classList.add(
          "marinecalc-preview-disabled"
        );

      }
    );


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
      Noon Calculation tool. Sample data is shown for
      demonstration only. An active PRO subscription
      is required to enter your own vessel data.
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


  const firstCalculator =
    document.querySelector(
      ".calculator-card"
    );


  if (firstCalculator) {

    firstCalculator.parentNode.insertBefore(
      banner,
      firstCalculator
    );

  } else {

    const main =
      document.querySelector("main");

    if (main) {

      main.prepend(banner);

    } else {

      document.body.prepend(banner);

    }

  }


  const firstSection =
    document.querySelector(
      ".calculator-card .section"
    );


  if (firstSection) {

    const previewLabel =
      document.createElement("div");


    previewLabel.className =
      "marinecalc-preview-label";


    previewLabel.innerHTML =
      "<span>PREVIEW DATA</span> — Sample values";


    firstSection.prepend(
      previewLabel
    );

  }


  document.getElementById(
    "counterPrevious"
  ).value =
    NOON_PREVIEW_DATA.counterPrevious;


  document.getElementById(
    "counterPresent"
  ).value =
    NOON_PREVIEW_DATA.counterPresent;


  document.getElementById(
    "runningTime"
  ).value =
    NOON_PREVIEW_DATA.runningTime;


  document.getElementById(
    "propellerPitch"
  ).value =
    NOON_PREVIEW_DATA.propellerPitch;


  document.getElementById(
    "existingConstantRev"
  ).value =
    NOON_PREVIEW_DATA.existingConstantRev;


  document.getElementById(
    "logDistance"
  ).value =
    NOON_PREVIEW_DATA.logDistance;


  document.getElementById(
    "ogDistance"
  ).value =
    NOON_PREVIEW_DATA.ogDistance;


  document.getElementById(
    "manualSpeedPropellerDistance"
  ).value =
    NOON_PREVIEW_DATA.manualSpeedPropellerDistance;


  const calculatedConstantRadio =
    document.querySelector(
      'input[name="constantSource"][value="calculated"]'
    );


  if (calculatedConstantRadio) {

    calculatedConstantRadio.checked =
      true;

  }


  const calculatedDistanceRadio =
    document.querySelector(
      'input[name="speedDistanceSource"][value="calculated"]'
    );


  if (calculatedDistanceRadio) {

    calculatedDistanceRadio.checked =
      true;

  }


  calculateRPM();

  calculateConstant();

  calculatePropeller();

  calculateSpeedSlip();

}


/* =========================================================
   MARINECALC PRO OFFLINE ACCESS
   NOON CALCULATION
   ========================================================= */


/* =========================================================
   GET CACHED PRO AUTHORIZATION
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


    const authorization =
      JSON.parse(raw);


    if (
      !authorization ||
      typeof authorization !== "object" ||
      !authorization.userId
    ) {

      return null;

    }


    /*
       Check expiration.
    */

    if (
      authorization.expiresAt
    ) {

      const expiry =
        new Date(
          authorization.expiresAt
        ).getTime();


      if (
        !Number.isFinite(expiry)
      ) {

        return null;

      }


      if (
        Date.now() >= expiry
      ) {

        console.warn(
          "MarineCalc: Cached PRO authorization has expired."
        );

        return null;

      }

    }


    return authorization;


  } catch (error) {

    console.error(
      "MarineCalc: Unable to read cached PRO authorization:",
      error
    );

    return null;

  }

}


/* =========================================================
   CHECK VALID OFFLINE PRO ACCESS
   ========================================================= */

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
    authorization.userId !== userId
  ) {

    console.warn(
      "MarineCalc: Cached PRO authorization belongs to another user."
    );

    return false;

  }


  return true;

}


/* =========================================================
   ENABLE PRO CALCULATOR
   ========================================================= */

function enableProCalculator() {

  /*
     Remove any PRO preview banner.
  */

  const previewBanner =
    document.getElementById(
      "marinecalcPreviewBanner"
    );


  if (previewBanner) {

    previewBanner.remove();

  }


  /*
     Remove preview labels.
  */

  document
    .querySelectorAll(
      ".marinecalc-preview-label"
    )
    .forEach(
      (element) => {

        element.remove();

      }
    );


  /*
     Enable every calculator control.
  */

  document
    .querySelectorAll(
      ".calculator-card input, .calculator-card button"
    )
    .forEach(
      (element) => {

        element.disabled = false;

        element.classList.remove(
          "marinecalc-preview-disabled"
        );

      }
    );


  console.log(
    "MarineCalc PRO calculator controls enabled."
  );

}


/* =========================================================
   SHOW OFFLINE PRO MODE
   ========================================================= */

function showOfflineProMode() {

  const authorization =
   getOfflineProAccess();


  if (!authorization) {

   console.warn(
     "MarineCalc: No valid cached PRO authorization."
   );

   return false;

  }


  /*
    VERY IMPORTANT:
    If user is actually ONLINE, just enable calculator
    without showing the offline banner.
  */

  if (navigator.onLine === true) {

   enableProCalculator();

   console.log(
     "MarineCalc PRO access enabled from cache (online)."
   );

   return true;

  }


  /*
    User is OFFLINE - show the offline banner.
  */

  enableProCalculator();


  /*
     Prevent duplicate banner.
  */

  if (
    document.getElementById(
      "marinecalcOfflineProBanner"
    )
  ) {

    return true;

  }


  /*
     Make sure banner styles exist.
  */

  addPreviewStyles();


  /*
     Create banner.
  */

  const banner =
    document.createElement("div");


  banner.id =
    "marinecalcOfflineProBanner";


  banner.className =
    "marinecalc-preview-banner";


  banner.innerHTML = `

    <strong>
      🟡 OFFLINE MODE — PRO VERIFIED
    </strong>

    <p>
      MarineCalc PRO access was previously verified
      online. You can continue using this calculator
      while offline.
    </p>

  `;


  /*
     Insert banner.
  */

  const firstCalculator =
    document.querySelector(
      ".calculator-card"
    );


  if (firstCalculator) {

    firstCalculator.parentNode.insertBefore(
      banner,
      firstCalculator
    );

  } else {

    const main =
      document.querySelector("main");


    if (main) {

      main.prepend(
        banner
      );

    } else {

      document.body.prepend(
        banner
      );

    }

  }


  console.log(
    "MarineCalc PRO operating in offline mode.",
    authorization.expiresAt
  );


  return true;

}


/* =========================================================
   MAIN PRO ACCESS CHECK
   ========================================================= */

async function checkProAccess() {

  /*
     =======================================================
     STEP 1 — TRY NORMAL ONLINE VERIFICATION
     =======================================================
  */

  try {

    const {
      data: sessionData,
      error: sessionError
    } =
      await supabaseClient
        .auth
        .getSession();


    /*
       -----------------------------------------------------
       SESSION ERROR
       -----------------------------------------------------
    */

    if (sessionError) {

      console.warn(
        "MarineCalc: Online session check failed."
      );


      /*
         FALL BACK TO CACHED PRO.
      */

      if (
        hasValidOfflineProAccess()
      ) {

        showOfflineProMode();

        return;

      }


      showProPreview();

      return;

    }


    /*
       -----------------------------------------------------
       NO SESSION
       -----------------------------------------------------
    */

    if (
      !sessionData ||
      !sessionData.session ||
      !sessionData.session.user
    ) {

      /*
         Before showing the PRO preview,
         check whether we have previously
         verified PRO access.
      */

      if (
        hasValidOfflineProAccess()
      ) {

        showOfflineProMode();

        return;

      }


      showProPreview();

      return;

    }


    const user =
      sessionData.session.user;


    /*
       =====================================================
       STEP 2 — CHECK PRO STATUS WITH SUPABASE
       =====================================================
    */

    const {
      data: isPro,
      error: proError
    } =
      await supabaseClient
        .rpc("is_pro");


    /*
       -----------------------------------------------------
       SUPABASE RPC FAILED
       -----------------------------------------------------
    */

    if (proError) {

      console.warn(
        "MarineCalc: PRO verification request failed.",
        proError
      );


      /*
         NETWORK FAILURE / OFFLINE FALLBACK
      */

      if (
        hasValidOfflineProAccess(
          user.id
        )
      ) {

        showOfflineProMode();

        return;

      }


      showProPreview();

      return;

    }


    /*
       -----------------------------------------------------
       USER IS NOT PRO
       -----------------------------------------------------
    */

    if (!isPro) {

      showProPreview();

      return;

    }


    /*
       =====================================================
       STEP 3 — GET SUBSCRIPTION EXPIRY
       =====================================================
    */

    const {
      data: subscription,
      error: subscriptionError
    } =
      await supabaseClient
        .from("pro_subscriptions")
        .select(
          "expires_at"
        )
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
            ascending: false
          }
        )
        .limit(1)
        .maybeSingle();


    /*
       -----------------------------------------------------
       SUBSCRIPTION QUERY FAILED
       -----------------------------------------------------
    */

    if (
      subscriptionError
    ) {

      console.warn(
        "MarineCalc: Subscription expiry lookup failed.",
        subscriptionError
      );


      /*
         If cached PRO exists, allow offline operation.
      */

      if (
        hasValidOfflineProAccess(
          user.id
        )
      ) {

        showOfflineProMode();

        return;

      }

    }


    /*
       =====================================================
       STEP 4 — CACHE PRO AUTHORIZATION
       =====================================================
    */

    if (
      subscription &&
      subscription.expires_at
    ) {

      try {

        localStorage.setItem(
          "marinecalc_offline_pro",
          JSON.stringify({

            userId:
              user.id,

            email:
              user.email || "",

            expiresAt:
              subscription.expires_at,

            verifiedAt:
              new Date().toISOString()

          })
        );


        console.log(
          "MarineCalc PRO access confirmed and cached for offline use."
        );


      } catch (cacheError) {

        console.warn(
          "MarineCalc: Unable to cache PRO authorization.",
          cacheError
        );

      }

    }


    /*
       =====================================================
       STEP 5 — ONLINE PRO ACCESS
       =====================================================
    */

    enableProCalculator();


    console.log(
      "MarineCalc PRO access confirmed."
    );


  } catch (error) {

    /*
       =====================================================
       FINAL FALLBACK
       =====================================================
    */

    console.warn(
      "MarineCalc: Online PRO verification failed.",
      error
    );


    /*
       CRITICAL:

       If Supabase is unreachable, use the cached
       authorization and UNLOCK the calculator.
    */

    if (
      hasValidOfflineProAccess(
				user.id
			)
    ) {

      console.log(
        "MarineCalc PRO access confirmed from cached authorization."
      );


      showOfflineProMode();


      return;

    }


    /*
       No valid cached PRO.
    */

    showProPreview();

  }

}


/* =========================================================
   START PRO ACCESS CHECK
   ========================================================= */

setTimeout(
 function () {

   checkProAccess();

 },
 0
);


/* =========================================================
   NETWORK STATE HANDLING
   ========================================================= */

window.addEventListener(
 "online",
 () => {

   console.log(
     "MarineCalc: Network connection restored."
   );


   /*
      Re-verify PRO status when connection returns.
   */

   checkProAccess();

 }
);


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

  return Number(
    document.getElementById(id).value
  );

}


function isBlank(id) {

  return (
    document
      .getElementById(id)
      .value
      .trim() === ""
  );

}


function setText(id, value) {

  document
    .getElementById(id)
    .textContent =
    value;

}


function setError(id, message) {

  document
    .getElementById(id)
    .textContent =
    message;

}


function format(value, decimals) {

  return Number(value)
    .toFixed(decimals);

}


/* =========================================================
   1. MAIN ENGINE RPM
   ========================================================= */

function calculateRPM() {

  setError(
    "rpmError",
    ""
  );


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


  const previous =
    numberValue(
      "counterPrevious"
    );


  const present =
    numberValue(
      "counterPresent"
    );


  const time =
    numberValue(
      "runningTime"
    );


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


  if (
    present < previous
  ) {

    setError(
      "rpmError",
      "Present Counter Reading cannot be less than Previous Counter Reading."
    );

    return;

  }


  if (
    time <= 0
  ) {

    setError(
      "rpmError",
      "Ship Running Time must be greater than zero."
    );

    return;

  }


  calculatedTotalRevolution =
    present - previous;


  calculatedAverageRpm =
    calculatedTotalRevolution /
    (time * 60);


  setText(
    "totalRevolution",
    calculatedTotalRevolution
      .toFixed(0)
  );


  setText(
    "averageRpm",
    calculatedAverageRpm
      .toFixed(2)
  );


  updateCarriedValues();


  document.getElementById(
    "rpmAudit"
  ).innerHTML = `

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

  setError(
    "constantError",
    ""
  );


  if (
    isBlank("propellerPitch")
  ) {

    setError(
      "constantError",
      "Enter Propeller Pitch to calculate ConstantREV."
    );

    return;

  }


  const pitchMm =
    numberValue(
      "propellerPitch"
    );


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


  const pitchMeters =
    pitchMm / 1000;


  calculatedConstantRev =
    pitchMeters / 1852;


  setText(
    "calculatedConstantRev",
    calculatedConstantRev
      .toFixed(10)
  );


  updateCarriedValues();


  document.getElementById(
    "constantAudit"
  ).innerHTML = `

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

  return document
    .querySelector(
      'input[name="constantSource"]:checked'
    )
    .value;

}


function getSpeedDistanceSource() {

  return document
    .querySelector(
      'input[name="speedDistanceSource"]:checked'
    )
    .value;

}


function getSelectedConstant() {

  const source =
    getConstantSource();


  if (
    source === "calculated"
  ) {

    if (
      calculatedConstantRev === null
    ) {

      setError(
        "propellerError",
        "Calculate the Propeller Constant first."
      );

      return null;

    }


    return calculatedConstantRev;

  }


  if (
    isBlank("existingConstantRev")
  ) {

    setError(
      "propellerError",
      "Enter the existing Propeller ConstantREV."
    );

    return null;

  }


  const existing =
    numberValue(
      "existingConstantRev"
    );


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

  setError(
    "propellerError",
    ""
  );


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


  if (
    constantRev === null
  ) {

    return;

  }


  const constantRpm =
    constantRev * 60;


  const distance =
    constantRev *
    calculatedTotalRevolution;


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


  setText(
    "selectedConstantRev",
    constantRev
      .toFixed(10)
  );


  setText(
    "constantRev",
    constantRev
      .toFixed(10)
  );


  setText(
    "constantRpm",
    constantRpm
      .toFixed(10)
  );


  setText(
    "propellerDistance",
    distance
      .toFixed(2)
  );


  setText(
    "propellerSpeed",
    speed
      .toFixed(2)
  );


  updateCarriedValues();


  const sourceText =
    getConstantSource() === "existing"
      ? "Existing ConstantREV entered by user"
      : "Calculated ConstantREV from Propeller Constant section";


  document.getElementById(
    "propellerAudit"
  ).innerHTML = `

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

  if (
    calculatedTotalRevolution !== null
  ) {

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


  if (
    calculatedAverageRpm !== null
  ) {

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


  if (
    selectedConstantRev !== null
  ) {

    setText(
      "selectedConstantRev",
      selectedConstantRev
        .toFixed(10)
    );

  } else {

    setText(
      "selectedConstantRev",
      "—"
    );

  }


  if (
    calculatedPropellerDistance !== null
  ) {

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


  if (
    calculatedPropellerSpeed !== null
  ) {

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

  setError(
    "speedSlipError",
    ""
  );


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
    calculatedPropellerSpeed === null
  ) {

    setError(
      "speedSlipError",
      "Calculate the Propeller section first."
    );

    return;

  }


  if (
    isBlank("runningTime")
  ) {

    setError(
      "speedSlipError",
      "Ship Running Time is required."
    );

    return;

  }


  const logDistanceValue =
    numberValue(
      "logDistance"
    );


  const ogDistanceValue =
    numberValue(
      "ogDistance"
    );


  const time =
    numberValue(
      "runningTime"
    );


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


  if (
    time <= 0
  ) {

    setError(
      "speedSlipError",
      "Ship Running Time must be greater than zero."
    );

    return;

  }


  let propellerDistanceForSlip;


  if (
    getSpeedDistanceSource() === "manual"
  ) {

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


  const logSpeedValue =
    logDistanceValue / time;


  const ogSpeedValue =
    ogDistanceValue / time;


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
  .forEach(
    (radio) => {

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

    }
  );


/* =========================================================
   UI — SPEED/SLIP DISTANCE SOURCE
   ========================================================= */

document
  .querySelectorAll(
    'input[name="speedDistanceSource"]'
  )
  .forEach(
    (radio) => {

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

    }
  );


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

    if (
      event.key !== "Enter"
    ) {

      return;

    }


    const active =
      document.activeElement;


    if (
      [
        "counterPrevious",
        "counterPresent",
        "runningTime"
      ].includes(
        active.id
      )
    ) {

      calculateRPM();


    } else if (
      active.id ===
      "propellerPitch"
    ) {

      calculateConstant();


    } else if (
      active.id ===
      "existingConstantRev"
    ) {

      calculatePropeller();


    } else if (
      active.id ===
      "manualSpeedPropellerDistance" ||
      active.id ===
      "logDistance" ||
      active.id ===
      "ogDistance"
    ) {

      calculateSpeedSlip();

    }

  }
);