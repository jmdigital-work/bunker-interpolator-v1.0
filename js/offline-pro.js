/* =========================================================
   MARINECALC
   OFFLINE PRO AUTHORIZATION
   ========================================================= */

const MARINECALC_OFFLINE_PRO_KEY =
  "marinecalc_offline_pro";


/* =========================================================
   SAVE VERIFIED PRO ACCESS
   ========================================================= */

function saveOfflineProAccess(user, expiresAt) {

  if (!user || !user.id || !expiresAt) {
    return false;
  }


  const authorization = {

    userId:
      user.id,

    email:
      user.email || "",

    expiresAt:
      expiresAt,

    verifiedAt:
      new Date().toISOString()

  };


  try {

    localStorage.setItem(
      MARINECALC_OFFLINE_PRO_KEY,
      JSON.stringify(
        authorization
      )
    );


    return true;

  } catch (error) {

    console.error(
      "Unable to save offline PRO authorization:",
      error
    );

    return false;

  }

}


/* =========================================================
   GET OFFLINE PRO AUTHORIZATION
   ========================================================= */

function getOfflineProAccess() {

  try {

    const stored =
      localStorage.getItem(
        MARINECALC_OFFLINE_PRO_KEY
      );


    if (!stored) {
      return null;
    }


    return JSON.parse(
      stored
    );

  } catch (error) {

    console.error(
      "Unable to read offline PRO authorization:",
      error
    );

    return null;

  }

}


/* =========================================================
   CHECK WHETHER OFFLINE PRO IS VALID
   ========================================================= */

function hasValidOfflineProAccess(
  userId = null
) {

  const authorization =
    getOfflineProAccess();


  if (!authorization) {
    return false;
  }


  /*
     If a user ID is supplied,
     make sure the cached authorization
     belongs to that user.
  */

  if (
    userId &&
    authorization.userId !== userId
  ) {

    return false;

  }


  /*
     Check subscription expiry.
  */

  if (
    !authorization.expiresAt
  ) {

    return false;

  }


  const expiry =
    new Date(
      authorization.expiresAt
    );


  if (
    Number.isNaN(
      expiry.getTime()
    )
  ) {

    return false;

  }


  if (
    expiry <= new Date()
  ) {

    /*
       Automatically remove expired
       offline authorization.
    */

    clearOfflineProAccess();

    return false;

  }


  return true;

}


/* =========================================================
   CLEAR OFFLINE PRO AUTHORIZATION
   ========================================================= */

function clearOfflineProAccess() {

  try {

    localStorage.removeItem(
      MARINECALC_OFFLINE_PRO_KEY
    );

  } catch (error) {

    console.error(
      "Unable to clear offline PRO authorization:",
      error
    );

  }

}


/* =========================================================
   OFFLINE MODE
   ========================================================= */

function isMarineCalcOffline() {

  return (
    navigator.onLine === false
  );

}


/* =========================================================
   PRO ACCESS STATUS
   ========================================================= */

function getOfflineProStatus() {

  const authorization =
    getOfflineProAccess();


  if (!authorization) {

    return {
      active: false,
      mode: "none",
      expiresAt: null
    };

  }


  if (
    !hasValidOfflineProAccess(
      authorization.userId
    )
  ) {

    return {
      active: false,
      mode: "expired",
      expiresAt:
        authorization.expiresAt
    };

  }


  return {

    active: true,

    mode:
      isMarineCalcOffline()
        ? "offline"
        : "cached",

    expiresAt:
      authorization.expiresAt

  };

}