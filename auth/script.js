/* =========================================================
   MARINECALC AUTHENTICATION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

/*
  Replace the two values below with the
  Project URL and Publishable Key from
  your Supabase project.
*/

const SUPABASE_URL =
  "https://lasdhuckmemuukiqovyw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_39hL-GbiMsBs2zuJmGM6cg_g34fj8s6";


/*
  Create the Supabase client.
*/

const {
  createClient
} = supabase;


const supabaseClient =
  createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   ELEMENTS
   ========================================================= */

const loginPanel =
  document.getElementById("loginPanel");

const signupPanel =
  document.getElementById("signupPanel");

const accountPanel =
  document.getElementById("accountPanel");

const authBackLink =
  document.getElementById("authBackLink");


const loginForm =
  document.getElementById("loginForm");

const signupForm =
  document.getElementById("signupForm");


const loginMessage =
  document.getElementById("loginMessage");

const signupMessage =
  document.getElementById("signupMessage");


const accountEmail =
  document.getElementById("accountEmail");

const accountRole =
  document.getElementById("accountRole");

const betaTesterBadge =
  document.getElementById("betaTesterBadge");

const betaTesterMessage =
  document.getElementById("betaTesterMessage");

const proPlan =
  document.getElementById("proPlan");

const proStatusCard =
  document.getElementById(
    "proStatusCard"
  );


const proStatusBadge =
  document.getElementById(
    "proStatusBadge"
  );


const proStatusTitle =
  document.getElementById(
    "proStatusTitle"
  );


const proStatusDescription =
  document.getElementById(
    "proStatusDescription"
  );


const proDetails =
  document.getElementById(
    "proDetails"
  );


const proActivated =
  document.getElementById(
    "proActivated"
  );


const proExpires =
  document.getElementById(
    "proExpires"
  );


const proTools =
  document.getElementById(
    "proTools"
  );

const proToolsTitle =
  document.getElementById(
    "proToolsTitle"
  );

const accountHomeNavigation =
  document.getElementById(
    "accountHomeNavigation"
  );


const getProSection =
  document.getElementById(
    "getProSection"
  );

const authParameters = new URLSearchParams(window.location.search);
const isBetaOnboarding = authParameters.get("beta") === "1";


/* =========================================================
   PANEL SWITCHING
   ========================================================= */

document
  .getElementById("showSignup")
  .addEventListener(
    "click",
    () => {

      loginPanel.hidden = true;

      signupPanel.hidden = false;

      loginMessage.textContent = "";

    }
  );


document
  .getElementById("showLogin")
  .addEventListener(
    "click",
    () => {

      signupPanel.hidden = true;

      loginPanel.hidden = false;

      signupMessage.textContent = "";

    }
  );


function openSignupFromHash() {

  if (isBetaOnboarding || window.location.hash === "#signup") {

    loginPanel.hidden = true;

    signupPanel.hidden = false;

  }

}


function getBetaRedirectUrl() {

  /* Preserve the app base path for Live Server and GitHub Pages. */
  return new URL("../beta/index.html", window.location.href).href;

}


function redirectToBetaIfNeeded() {

  if (!isBetaOnboarding) {
    return false;
  }

  window.location.replace(getBetaRedirectUrl());

  return true;

}


/* =========================================================
   SIGN UP
   ========================================================= */

signupForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    signupMessage.textContent = "";

    signupMessage.className = "message";


    const fullName =
      document
        .getElementById("signupName")
        .value
        .trim();


    const email =
      document
        .getElementById("signupEmail")
        .value
        .trim();


    const password =
      document
        .getElementById("signupPassword")
        .value;


    const confirmPassword =
      document
        .getElementById("signupConfirmPassword")
        .value;


    if (password !== confirmPassword) {

      signupMessage.textContent =
        "Passwords do not match.";

      signupMessage.classList.add(
        "error"
      );

      return;

    }


    /*
      Create the Supabase Auth user.

      We also send full_name as metadata.

      Our database trigger will use this
      metadata when creating the profile.
    */

    const signupOptions = {

      data: {

        full_name: fullName

      }

    };

    if (isBetaOnboarding) {

      signupOptions.emailRedirectTo = getBetaRedirectUrl();

    }


    const {
      data,
      error
    } = await supabaseClient.auth.signUp({

      email: email,

      password: password,

      options: signupOptions

    });


    if (error) {

      signupMessage.textContent =
        error.message;

      signupMessage.classList.add(
        "error"
      );

      return;

    }


    /*
      Supabase may require email confirmation.
    */

    if (
      data.user &&
      !data.session
    ) {

      signupMessage.textContent = isBetaOnboarding
        ? "Account created! Please check your email to confirm your MarineCalc account. After confirmation, you'll be taken directly to the Beta Tester application."
        : "Account created. Please check your email to confirm your account.";

      signupMessage.classList.add(
        "success"
      );

      signupForm.reset();

      return;

    }


    if (isBetaOnboarding) {

      redirectToBetaIfNeeded();

      return;

    }


    signupMessage.textContent =
      "Account created successfully.";

    signupMessage.classList.add(
      "success"
    );

  }
);


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    loginMessage.textContent = "";

    loginMessage.className = "message";


    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim();


    const password =
      document
        .getElementById("loginPassword")
        .value;


    const {
      data,
      error
    } = await supabaseClient.auth.signInWithPassword({

      email: email,

      password: password

    });


    if (error) {

      loginMessage.textContent =
        error.message;

      loginMessage.classList.add(
        "error"
      );

      return;

    }


    if (data.user) {

      if (redirectToBetaIfNeeded()) {
        return;
      }

      await showAccount(
        data.user
      );

    }

  }
);


/* =========================================================
   LOGOUT
   ========================================================= */

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    async () => {

      const {
        error
      } =
        await supabaseClient
          .auth
          .signOut();


      if (error) {

        alert(
          error.message
        );

        return;

      }


      try {

        localStorage.removeItem(
          "marinecalc_offline_pro"
        );

      } catch (storageError) {

        console.warn(
          "Unable to clear cached PRO authorization on logout:",
          storageError
        );

      }


      accountPanel.hidden = true;

      loginPanel.hidden = false;

      authBackLink.hidden = false;

      loginForm.reset();

    }
  );

/* =========================================================
   LOAD PRO STATUS
   ========================================================= */

async function loadProStatus(
  user
) {

  /*
    Reset the account display.
  */

  proStatusBadge.textContent =
    "CHECKING PRO STATUS...";

  proStatusTitle.textContent =
    "MarineCalc PRO";

  proStatusDescription.textContent =
    "Checking your subscription...";

  proDetails.hidden = true;

  proTools.hidden = true;

  getProSection.hidden = true;


  /*
    Retrieve the user's subscription.

    We order by activated_at so that if a
    user has multiple historical subscriptions,
    we use the latest one.
  */

  const {
    data: subscription,
    error
  } =
    await supabaseClient
      .from("pro_subscriptions")
      .select(
        "plan, status, activated_at, expires_at"
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "activated_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle();


  if (error) {

    console.error(
      "PRO subscription query error:",
      error
    );

    proStatusBadge.textContent =
      "PRO STATUS UNAVAILABLE";

    proStatusTitle.textContent =
      "Unable to check PRO status";

    proStatusDescription.textContent =
      "Please try again later.";

    return;

  }


  /*
    No subscription exists.
  */

  if (!subscription) {

    showFreeStatus();

    return;

  }


  /*
    Check both status and expiration.
  */

  const isActive =
    subscription.status === "active";


  const isLifetimeBeta =
    subscription.plan === "BETA_LIFETIME" &&
    !subscription.expires_at;


  const isNotExpired =
    isLifetimeBeta ||
    (
      subscription.expires_at &&
      new Date(subscription.expires_at).getTime() > Date.now()
    );


  if (
    isActive &&
    isNotExpired
  ) {

    showActiveProStatus(
      subscription
    );

    return;

  }


  /*
    Subscription exists but is no longer valid.
  */

  showExpiredStatus(
    subscription
  );

}


/* =========================================================
   ACTIVE PRO
   ========================================================= */

function showActiveProStatus(
  subscription
) {

  const isBetaTester =
    subscription.plan === "BETA_LIFETIME";

  proStatusCard.className =
    isBetaTester
      ? "pro-status-card pro-active beta-active"
      : "pro-status-card pro-active";


  proStatusBadge.className =
    isBetaTester
      ? "pro-status-badge active beta-badge"
      : "pro-status-badge active";


  proStatusBadge.textContent =
    isBetaTester
      ? "🧪 FOUNDING BETA TESTER"
      : "● ACTIVE";


  proStatusTitle.textContent =
    isBetaTester
      ? "MARINECALC LIFETIME PRO"
      : "MARINECALC PRO";


  proStatusDescription.textContent =
    isBetaTester
      ? "You have complimentary Lifetime PRO access as a Founding Beta Tester."
      : "Your PRO subscription is active.";


  proDetails.hidden = false;

  proTools.hidden = false;

  accountHomeNavigation.hidden = false;


  proToolsTitle.textContent =
    "PRO TOOLS";


  proTools.className =
    "pro-tools";


  getProSection.hidden = true;


  /*
     Show the correct plan.
  */

  if (isBetaTester) {

    proPlan.textContent =
      "FOUNDING BETA — LIFETIME PRO";

    proActivated.textContent =
      formatDate(
        subscription.activated_at
      );

    proExpires.textContent =
      "NEVER — LIFETIME ACCESS";

    betaTesterBadge.hidden = false;

    betaTesterMessage.hidden = false;

  } else {

    proPlan.textContent =
      "LIFETIME PRO";

    proActivated.textContent =
      formatDate(
        subscription.activated_at
      );

    proExpires.textContent =
      subscription.expires_at
        ? formatDate(subscription.expires_at)
        : "NEVER — LIFETIME ACCESS";

    betaTesterBadge.hidden = true;

    betaTesterMessage.hidden = true;

  }

}

/* =========================================================
   FREE USER
   ========================================================= */

function showFreeStatus() {

  betaTesterBadge.hidden = true;
  betaTesterMessage.hidden = true;

  proStatusCard.className =
    "pro-status-card pro-free";


  proStatusBadge.className =
    "pro-status-badge free";


  proStatusBadge.textContent =
    "● FREE";


  proStatusTitle.textContent =
    "MARINECALC PRO";


  proStatusDescription.textContent =
    "You currently have a Free account.";


  proDetails.hidden = true;

  proTools.hidden = false;

  getProSection.hidden = false;

  accountHomeNavigation.hidden = true;

  proToolsTitle.textContent =
    "EXPLORE PRO TOOLS";


  /*
    Show the tools as features available
    with PRO, rather than as active tools.
  */

  proTools.className =
    "pro-tools";

}


/* =========================================================
   EXPIRED PRO
   ========================================================= */

function showExpiredStatus(
  subscription
) {

  betaTesterBadge.hidden = true;
  betaTesterMessage.hidden = true;

  proStatusCard.className =
    "pro-status-card pro-expired";


  proStatusBadge.className =
    "pro-status-badge expired";


  proStatusBadge.textContent =
    "● EXPIRED";


  proStatusTitle.textContent =
    "MARINECALC PRO";


  proStatusDescription.textContent =
    "Your PRO subscription has expired.";


  proDetails.hidden = false;

  proTools.hidden = false;

  getProSection.hidden = false;


  proActivated.textContent =
    formatDate(
      subscription.activated_at
    );


  proExpires.textContent =
    formatDate(
      subscription.expires_at
    );


  proTools.className =
    "pro-tools pro-tools-locked";

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(
  value
) {

  if (!value) {

    return "—";

  }


  return new Date(
    value
  ).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );

}


/* =========================================================
   SHOW ACCOUNT
   ========================================================= */

async function showAccount(user) {

  if (redirectToBetaIfNeeded()) {
    return;
  }

  /*
    Retrieve the user's MarineCalc
    profile.

    This is where RLS will determine
    whether the user is allowed to
    read this profile.
  */

  const {
    data: profile,
    error
  } = await supabaseClient
    .from("profiles")
    .select(
      "full_name, is_admin"
    )
    .eq(
      "id",
      user.id
    )
    .single();


if (error) {

  console.error("Profile query error:", error);

  accountRole.textContent =
    "Profile error: " + error.message;

  return;

}

  if (profile.is_admin) {

    window.location.href =
      "../admin/index.html";

    return;

  }

  loginPanel.hidden = true;

  signupPanel.hidden = true;

  accountPanel.hidden = false;

  authBackLink.hidden = true;

  accountEmail.textContent =
    user.email || "";

  accountRole.textContent =
    "MARINECALC USER";

  await loadProStatus(user);

}


/* =========================================================
   CHECK EXISTING SESSION
   ========================================================= */

async function checkSession() {

  const {
    data
  } =
    await supabaseClient
      .auth
      .getSession();


  const session =
    data.session;


  if (session && session.user) {

    await showAccount(
      session.user
    );

  }

}


/* =========================================================
   AUTH STATE CHANGES
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
  async (event, session) => {

    if (
      session &&
      session.user
    ) {

      if (redirectToBetaIfNeeded()) {
        return;
      }

      await showAccount(
        session.user
      );

    }

  }
);


/* =========================================================
   START
   ========================================================= */

openSignupFromHash();

checkSession();
