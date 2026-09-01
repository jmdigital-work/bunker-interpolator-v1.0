/* =========================================================
   MARINECALC ROOT
   PRO TOOL SMART ROUTING
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
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
   PRO SUBSCRIPTION CHECK
   ========================================================= */

async function hasActivePro() {

  try {

    /*
      Check the current login session.
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
        "Session check error:",
        sessionError
      );

      return false;

    }


    /*
      User is not logged in.
    */

    if (
      !sessionData.session ||
      !sessionData.session.user
    ) {

      return false;

    }


    /*
      Check the user's subscription.
    */

    const {
      data,
      error
    } =
      await supabaseClient
        .from("pro_subscriptions")
        .select(
          "status, expires_at"
        )
        .eq(
          "user_id",
          sessionData.session.user.id
        )
        .eq(
          "status",
          "active"
        )
        .maybeSingle();


    if (error) {

      console.error(
        "PRO subscription check error:",
        error
      );

      return false;

    }


    /*
      Confirm that the subscription
      has not expired.
    */

    if (
      data &&
      data.status === "active" &&
      data.expires_at &&
      new Date(data.expires_at) > new Date()
    ) {

      return true;

    }


    return false;


  } catch (error) {

    console.error(
      "PRO access error:",
      error
    );

    return false;

  }

}


/* =========================================================
   BUNKER MT ROUTING
   ========================================================= */

const bunkerMtCard =
  document.getElementById(
    "bunkerMtCard"
  );


if (bunkerMtCard) {

  bunkerMtCard.addEventListener(
    "click",
    async (event) => {

      /*
        Stop the normal href navigation
        while we check PRO status.
      */

      event.preventDefault();


      /*
        Check subscription.
      */

      const isPro =
        await hasActivePro();


      if (isPro) {

        /*
          APPROVED PRO USER
          → Go directly to calculator.
        */

        window.location.href =
          "calculators/bunker-mt/index.html";

      } else {

        /*
          FREE / LOGGED OUT / EXPIRED
          → Go to PRO page.
        */

        window.location.href =
          "pro/index.html";

      }

    }
  );

}


/* =========================================================
   NOON CALCULATION ROUTING
   ========================================================= */

const noonCalculationCard =
  document.getElementById(
    "noonCalculationCard"
  );


if (noonCalculationCard) {

  noonCalculationCard.addEventListener(
    "click",
    async (event) => {

      /*
        Stop normal navigation.
      */

      event.preventDefault();


      /*
        Check subscription.
      */

      const isPro =
        await hasActivePro();


      if (isPro) {

        /*
          APPROVED PRO USER
          → Go directly to calculator.
        */

        window.location.href =
          "calculators/noon-calculation/index.html";

      } else {

        /*
          FREE / LOGGED OUT / EXPIRED
          → Go to PRO page.
        */

        window.location.href =
          "pro/index.html";

      }

    }
  );

}