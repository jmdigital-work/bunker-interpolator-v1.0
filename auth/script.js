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

  if (window.location.hash === "#signup") {

    loginPanel.hidden = true;

    signupPanel.hidden = false;

  }

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

    const {
      data,
      error
    } = await supabaseClient.auth.signUp({

      email: email,

      password: password,

      options: {

        data: {

          full_name: fullName

        }

      }

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

      signupMessage.textContent =
        "Account created. Please check your email to confirm your account.";

      signupMessage.classList.add(
        "success"
      );

      signupForm.reset();

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
        "status, activated_at, expires_at"
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

  const expiresAt =
    new Date(
      subscription.expires_at
    );


  const isActive =
    subscription.status === "active";


  const isNotExpired =
    expiresAt.getTime() >
    Date.now();


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

  proStatusCard.className =
    "pro-status-card pro-active";


  proStatusBadge.className =
    "pro-status-badge active";


  proStatusBadge.textContent =
    "● ACTIVE";


  proStatusTitle.textContent =
    "MARINECALC PRO";


  proStatusDescription.textContent =
    "Your PRO subscription is active.";


  proDetails.hidden = false;

  proTools.hidden = false;

  accountHomeNavigation.hidden = false;

  proToolsTitle.textContent =
    "PRO TOOLS";

  proTools.className =
    "pro-tools";

  getProSection.hidden = true;


  proActivated.textContent =
    formatDate(
      subscription.activated_at
    );


  proExpires.textContent =
    formatDate(
      subscription.expires_at
    );

}


/* =========================================================
   FREE USER
   ========================================================= */

function showFreeStatus() {

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