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


      accountPanel.hidden = true;

      loginPanel.hidden = false;

      loginForm.reset();

    }
  );


/* =========================================================
   SHOW ACCOUNT
   ========================================================= */

async function showAccount(user) {

  loginPanel.hidden = true;

  signupPanel.hidden = true;

  accountPanel.hidden = false;


  accountEmail.textContent =
    user.email || "";


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

    accountRole.textContent =
      "MARINECALC ADMIN";

  } else {

    accountRole.textContent =
      "MARINECALC USER";

  }

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

checkSession();