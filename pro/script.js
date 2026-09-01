/* =========================================================
   MARINECALC PRO REQUEST
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
   SETTINGS
   ========================================================= */

const BUCKET_NAME =
  "payment-proofs";


const MAX_FILE_SIZE =
  5 * 1024 * 1024;


const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg"
];


/* =========================================================
   ELEMENTS
   ========================================================= */

const proForm =
  document.getElementById(
    "proForm"
  );


const submitButton =
  document.getElementById(
    "submitButton"
  );


const message =
  document.getElementById(
    "message"
  );


const fileInput =
  document.getElementById(
    "paymentProof"
  );


const fileInfo =
  document.getElementById(
    "fileInfo"
  );


const loginNotice =
  document.getElementById(
    "loginNotice"
  );


const successPanel =
  document.getElementById(
    "successPanel"
  );


/* =========================================================
   CURRENT USER
   ========================================================= */

let currentUser = null;


/* =========================================================
   CHECK SESSION
   ========================================================= */

async function checkSession() {

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getSession();


  if (error) {

    console.error(
      "Session error:",
      error
    );

    showLoginNotice();

    return;

  }


  if (
    data.session &&
    data.session.user
  ) {

    currentUser =
      data.session.user;

    loginNotice.hidden = true;

    await checkExistingSubscription();

  } else {

    showLoginNotice();

  }

}


/* =========================================================
   LOGIN NOTICE
   ========================================================= */

function showLoginNotice() {

  loginNotice.hidden = false;

  submitButton.disabled = true;

}


/* =========================================================
   CHECK EXISTING PRO
   ========================================================= */

async function checkExistingSubscription() {

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
        currentUser.id
      )
      .eq(
        "status",
        "active"
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Subscription check error:",
      error
    );

    return;

  }


  if (
    data &&
    new Date(data.expires_at) > new Date()
  ) {

    proForm.hidden = true;

    successPanel.hidden = false;

    successPanel.querySelector(
      "h2"
    ).textContent =
      "PRO Already Active";

    successPanel.querySelector(
      "p"
    ).textContent =
      "Your MarineCalc PRO subscription is already active.";

  }

}


/* =========================================================
   FILE SELECTION
   ========================================================= */

fileInput.addEventListener(
  "change",
  () => {

    const file =
      fileInput.files[0];


    fileInfo.hidden = true;

    fileInfo.textContent = "";


    if (!file) {

      return;

    }


    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {

      showError(
        "Please upload a PNG or JPG/JPEG image."
      );

      fileInput.value = "";

      return;

    }


    if (
      file.size > MAX_FILE_SIZE
    ) {

      showError(
        "The payment proof must be 5 MB or smaller."
      );

      fileInput.value = "";

      return;

    }


    fileInfo.textContent =
      `${file.name} — ${formatFileSize(file.size)}`;

    fileInfo.hidden = false;

  }
);


/* =========================================================
   SUBMIT REQUEST
   ========================================================= */

proForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    clearMessage();


    if (!currentUser) {

      showError(
        "Please log in before submitting a PRO request."
      );

      return;

    }


    const paymentMethod =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );


    const paymentReference =
      document
        .getElementById(
          "paymentReference"
        )
        .value
        .trim();


    const paymentDate =
      document
        .getElementById(
          "paymentDate"
        )
        .value;


    const proofFile =
      fileInput.files[0];


    if (!paymentMethod) {

      showError(
        "Please select a payment method."
      );

      return;

    }


    if (!paymentReference) {

      showError(
        "Please enter your payment reference."
      );

      return;

    }


    if (!paymentDate) {

      showError(
        "Please enter the payment date."
      );

      return;

    }


    if (!proofFile) {

      showError(
        "Please upload your payment proof."
      );

      return;

    }


    if (
      !ALLOWED_TYPES.includes(
        proofFile.type
      )
    ) {

      showError(
        "Only PNG and JPG/JPEG files are allowed."
      );

      return;

    }


    if (
      proofFile.size > MAX_FILE_SIZE
    ) {

      showError(
        "The payment proof must be 5 MB or smaller."
      );

      return;

    }


    submitButton.disabled = true;

    submitButton.textContent =
      "SUBMITTING...";


    try {

      /*
        First check whether the user already
        has a pending request.

        This prevents accidental duplicate
        submissions.
      */

      const {
        data: existingRequest,
        error: existingError
      } =
        await supabaseClient
          .from("pro_requests")
          .select("id, status")
          .eq(
            "user_id",
            currentUser.id
          )
          .eq(
            "status",
            "pending"
          )
          .maybeSingle();


      if (existingError) {

        throw existingError;

      }


      if (existingRequest) {

        throw new Error(
          "You already have a PRO request waiting for review."
        );

      }


      /*
        Create a unique file name.

        The user's UUID is the first folder,
        which matches our Storage RLS policy.
      */

      const fileExtension =
        getFileExtension(
          proofFile
        );


      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;


      const filePath =
        `${currentUser.id}/${fileName}`;


      /*
        Upload payment proof.
      */

      const {
        error: uploadError
      } =
        await supabaseClient
          .storage
          .from(BUCKET_NAME)
          .upload(
            filePath,
            proofFile,
            {
              contentType:
                proofFile.type,

              upsert: false
            }
          );


      if (uploadError) {

        throw uploadError;

      }


      /*
        Create the PRO request.

        We store the Storage path in the
        payment_reference field temporarily
        only if needed? No.

        The current pro_requests table needs
        a proof path column.

        That column will be added before
        this request is fully operational.
      */

      const {
        error: requestError
      } =
        await supabaseClient
          .from("pro_requests")
          .insert({

            user_id:
              currentUser.id,

            full_name:
              currentUser.user_metadata
                ?.full_name ||
              "MarineCalc User",

            email:
              currentUser.email,

            payment_method:
              paymentMethod.value,

            payment_reference:
              paymentReference,

            payment_date:
              paymentDate,

            payment_amount:
              9.00,

            payment_proof_path:
              filePath,

            status:
              "pending"

          });


      if (requestError) {

        /*
          If the database insert fails after
          the file upload, remove the orphaned
          file so Storage stays clean.
        */

        await supabaseClient
          .storage
          .from(BUCKET_NAME)
          .remove([
            filePath
          ]);


        throw requestError;

      }


      /*
        Successful submission.
      */

      proForm.hidden = true;

      successPanel.hidden = false;

      clearMessage();


    } catch (error) {

      console.error(
        "PRO request error:",
        error
      );


      showError(
        error.message ||
        "Unable to submit your PRO request."
      );


      submitButton.disabled = false;

      submitButton.textContent =
        "SUBMIT PRO REQUEST";

    }

  }
);


/* =========================================================
   HELPERS
   ========================================================= */

function getFileExtension(
  file
) {

  if (
    file.type ===
    "image/png"
  ) {

    return "png";

  }


  return "jpg";

}


function formatFileSize(
  bytes
) {

  const mb =
    bytes / (
      1024 * 1024
    );


  return `${mb.toFixed(2)} MB`;

}


function showError(
  text
) {

  message.textContent =
    text;

  message.className =
    "message error";

}


function clearMessage() {

  message.textContent =
    "";

  message.className =
    "message";

}


/* =========================================================
   START
   ========================================================= */

checkSession();