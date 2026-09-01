/* =========================================================
   MARINECALC ADMIN DASHBOARD
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


/* =========================================================
   ELEMENTS
   ========================================================= */

const loadingMessage =
  document.getElementById(
    "loadingMessage"
  );


const accessDenied =
  document.getElementById(
    "accessDenied"
  );


const dashboard =
  document.getElementById(
    "dashboard"
  );


const requestsContainer =
  document.getElementById(
    "requestsContainer"
  );


const pendingCount =
  document.getElementById(
    "pendingCount"
  );


const approvedCount =
  document.getElementById(
    "approvedCount"
  );


const rejectedCount =
  document.getElementById(
    "rejectedCount"
  );


const adminMessage =
  document.getElementById(
    "adminMessage"
  );


/* =========================================================
   CHECK ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

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

    showAccessDenied();

    return;

  }


  const session =
    data.session;


  if (
    !session ||
    !session.user
  ) {

    window.location.href =
      "../auth/index.html";

    return;

  }


  const {
    data: adminStatus,
    error: adminError
  } =
    await supabaseClient
      .rpc("is_admin");


  if (adminError) {

    console.error(
      "Admin check error:",
      adminError
    );

    showAccessDenied();

    return;

  }


  if (!adminStatus) {

    showAccessDenied();

    return;

  }


  loadingMessage.hidden = true;

  dashboard.hidden = false;


  await loadRequests();

}


/* =========================================================
   ACCESS DENIED
   ========================================================= */

function showAccessDenied() {

  loadingMessage.hidden = true;

  dashboard.hidden = true;

  accessDenied.hidden = false;

}


/* =========================================================
   LOAD PRO REQUESTS
   ========================================================= */

async function loadRequests() {

  requestsContainer.innerHTML = `
    <div class="empty-state">
      Loading PRO requests...
    </div>
  `;


  const {
    data,
    error
  } =
    await supabaseClient
      .from("pro_requests")
      .select(`
        id,
        user_id,
        full_name,
        email,
        payment_method,
        payment_reference,
        payment_date,
        payment_amount,
        payment_proof_path,
        status,
        submitted_at
      `)
      .order(
        "submitted_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "PRO request query error:",
      error
    );


    requestsContainer.innerHTML = `
      <div class="empty-state">
        Unable to load PRO requests.
      </div>
    `;

    return;

  }


  updateSummary(
    data || []
  );


  renderRequests(
    data || []
  );

}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(
  requests
) {

  pendingCount.textContent =
    requests.filter(
      request =>
        request.status === "pending"
    ).length;


  approvedCount.textContent =
    requests.filter(
      request =>
        request.status === "approved"
    ).length;


  rejectedCount.textContent =
    requests.filter(
      request =>
        request.status === "rejected"
    ).length;

}


/* =========================================================
   RENDER REQUESTS
   ========================================================= */

function renderRequests(
  requests
) {

  if (!requests.length) {

    requestsContainer.innerHTML = `
      <div class="empty-state">
        No PRO requests found.
      </div>
    `;

    return;

  }


  requestsContainer.innerHTML =
    requests
      .map(
        request =>
          createRequestCard(
            request
          )
      )
      .join("");


  attachRequestActions();

}


/* =========================================================
   REQUEST CARD
   ========================================================= */

function createRequestCard(
  request
) {

  const status =
    request.status || "pending";


  const statusClass =
    `status-${status}`;


  const paymentDate =
    request.payment_date
      ? formatDate(
          request.payment_date
        )
      : "—";


  const submittedDate =
    request.submitted_at
      ? formatDateTime(
          request.submitted_at
        )
      : "—";


  const actions =
    status === "pending"
      ? `
        <div class="request-actions">

          <button
            class="action-button view-proof"
            data-action="proof"
            data-id="${request.id}"
          >
            VIEW PAYMENT PROOF
          </button>

          <button
            class="action-button approve-button"
            data-action="approve"
            data-id="${request.id}"
          >
            APPROVE
          </button>

          <button
            class="action-button reject-button"
            data-action="reject"
            data-id="${request.id}"
          >
            REJECT
          </button>

        </div>
      `
      : `
        <div class="request-actions">

          <button
            class="action-button view-proof"
            data-action="proof"
            data-id="${request.id}"
          >
            VIEW PAYMENT PROOF
          </button>

        </div>
      `;


  return `
    <article class="request-card">

      <div class="request-top">

        <div>

          <h3 class="request-name">
            ${escapeHtml(
              request.full_name
            )}
          </h3>

          <p class="request-email">
            ${escapeHtml(
              request.email
            )}
          </p>

        </div>


        <span
          class="status-badge ${statusClass}"
        >
          ${escapeHtml(
            status
          )}
        </span>

      </div>


      <div class="request-details">


        <div class="detail">

          <span class="detail-label">
            Payment Method
          </span>

          <span class="detail-value">
            ${escapeHtml(
              request.payment_method
            )}
          </span>

        </div>


        <div class="detail">

          <span class="detail-label">
            Amount
          </span>

          <span class="detail-value">
            $${Number(
              request.payment_amount
            ).toFixed(2)}
          </span>

        </div>


        <div class="detail">

          <span class="detail-label">
            Payment Reference
          </span>

          <span class="detail-value">
            ${escapeHtml(
              request.payment_reference
            )}
          </span>

        </div>


        <div class="detail">

          <span class="detail-label">
            Payment Date
          </span>

          <span class="detail-value">
            ${paymentDate}
          </span>

        </div>


        <div class="detail">

          <span class="detail-label">
            Submitted
          </span>

          <span class="detail-value">
            ${submittedDate}
          </span>

        </div>


      </div>


      ${actions}

    </article>
  `;

}


/* =========================================================
   ATTACH ACTIONS
   ========================================================= */

function attachRequestActions() {

  document
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          handleRequestAction
        );

      }
    );

}


/* =========================================================
   HANDLE ACTION
   ========================================================= */

async function handleRequestAction(
  event
) {

  const button =
    event.currentTarget;


  const action =
    button.dataset.action;


  const requestId =
    button.dataset.id;


  if (action === "proof") {

    await viewPaymentProof(
      requestId
    );

    return;

  }


  if (action === "approve") {

    await approveRequest(
      requestId,
      button
    );

    return;

  }


  if (action === "reject") {

    await rejectRequest(
      requestId,
      button
    );

  }

}


/* =========================================================
   VIEW PAYMENT PROOF
   ========================================================= */

async function viewPaymentProof(
  requestId
) {

  clearAdminMessage();


  const {
    data,
    error
  } =
    await supabaseClient
      .from("pro_requests")
      .select(
        "payment_proof_path"
      )
      .eq(
        "id",
        requestId
      )
      .single();


  if (error) {

    console.error(
      "Proof path error:",
      error
    );

    showAdminError(
      "Unable to retrieve payment proof."
    );

    return;

  }


  if (
    !data.payment_proof_path
  ) {

    showAdminError(
      "No payment proof is attached to this request."
    );

    return;

  }


  /*
    Create a temporary signed URL.

    The Storage bucket remains private.
  */

  const {
    data: signedData,
    error: signedError
  } =
    await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .createSignedUrl(
        data.payment_proof_path,
        300
      );


  if (signedError) {

    console.error(
      "Signed URL error:",
      signedError
    );

    showAdminError(
      "Unable to open payment proof."
    );

    return;

  }


  window.open(
    signedData.signedUrl,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =========================================================
   APPROVE REQUEST
   ========================================================= */

async function approveRequest(
  requestId,
  button
) {

  const confirmed =
    window.confirm(
      "Approve this PRO request and activate 1 year of PRO access?"
    );


  if (!confirmed) {

    return;

  }


  clearAdminMessage();


  button.disabled = true;

  button.textContent =
    "APPROVING...";


  try {

    /*
      The approval itself is handled
      by a database RPC.

      This prevents the browser from
      directly deciding subscription dates.
    */

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "approve_pro_request",
          {
            request_id:
              requestId
          }
        );


    if (error) {

      throw error;

    }


    if (!data) {

      throw new Error(
        "The request could not be approved."
      );

    }


    showAdminSuccess(
      "PRO request approved and subscription activated."
    );


    await loadRequests();


  } catch (error) {

    console.error(
      "Approval error:",
      error
    );


    showAdminError(
      error.message ||
      "Unable to approve the PRO request."
    );


    button.disabled = false;

    button.textContent =
      "APPROVE";

  }

}


/* =========================================================
   REJECT REQUEST
   ========================================================= */

async function rejectRequest(
  requestId,
  button
) {

  const confirmed =
    window.confirm(
      "Reject this PRO request?"
    );


  if (!confirmed) {

    return;

  }


  clearAdminMessage();


  button.disabled = true;

  button.textContent =
    "REJECTING...";


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "reject_pro_request",
          {
            request_id:
              requestId
          }
        );


    if (error) {

      throw error;

    }


    if (!data) {

      throw new Error(
        "The request could not be rejected."
      );

    }


    showAdminSuccess(
      "PRO request rejected."
    );


    await loadRequests();


  } catch (error) {

    console.error(
      "Rejection error:",
      error
    );


    showAdminError(
      error.message ||
      "Unable to reject the PRO request."
    );


    button.disabled = false;

    button.textContent =
      "REJECT";

  }

}


/* =========================================================
   MESSAGES
   ========================================================= */

function showAdminSuccess(
  text
) {

  adminMessage.textContent =
    text;

  adminMessage.className =
    "admin-message success";

}


function showAdminError(
  text
) {

  adminMessage.textContent =
    text;

  adminMessage.className =
    "admin-message error";

}


function clearAdminMessage() {

  adminMessage.textContent =
    "";

  adminMessage.className =
    "admin-message";

}


/* =========================================================
   DATE FORMATTING
   ========================================================= */

function formatDate(
  value
) {

  return new Date(
    value + "T00:00:00"
  ).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

}


function formatDateTime(
  value
) {

  return new Date(
    value
  ).toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   REFRESH
   ========================================================= */

document
  .getElementById(
    "refreshButton"
  )
  .addEventListener(
    "click",
    loadRequests
  );


/* =========================================================
   LOGOUT
   ========================================================= */

document
  .getElementById(
    "logoutButton"
  )
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


      window.location.href =
        "../auth/index.html";

    }
  );


/* =========================================================
   AUTH STATE
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
  async (
    event,
    session
  ) => {

    if (
      event === "SIGNED_OUT"
    ) {

      window.location.href =
        "../auth/index.html";

    }

  }
);


/* =========================================================
   START
   ========================================================= */

checkAdminAccess();