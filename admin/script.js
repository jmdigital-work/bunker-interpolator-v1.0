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


/* =========================================================
   CHECK ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  /*
    Get the current Supabase session.
  */

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


  /*
    No logged-in user.
  */

  if (
    !session ||
    !session.user
  ) {

    showAccessDenied();

    return;

  }


  /*
    Ask the database whether this
    authenticated user is an admin.
  */

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


  /*
    User is authenticated but
    not an administrator.
  */

  if (!adminStatus) {

    showAccessDenied();

    return;

  }


  /*
    Administrator confirmed.
  */

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
        full_name,
        email,
        payment_method,
        payment_reference,
        payment_date,
        payment_amount,
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

  const pending =
    requests.filter(
      request =>
        request.status === "pending"
    ).length;


  const approved =
    requests.filter(
      request =>
        request.status === "approved"
    ).length;


  const rejected =
    requests.filter(
      request =>
        request.status === "rejected"
    ).length;


  pendingCount.textContent =
    pending;


  approvedCount.textContent =
    approved;


  rejectedCount.textContent =
    rejected;

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

    </article>
  `;

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