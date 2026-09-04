const SUPABASE_URL = "https://lasdhuckmemuukiqovyw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_39hL-GbiMsBs2zuJmGM6cg_g34fj8s6";
const BETA_LIMIT = 50;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const availabilityCard = document.querySelector(".availability-card");
const availabilityCount = document.getElementById("availabilityCount");
const availabilityMessage = document.getElementById("availabilityMessage");
const loginPanel = document.getElementById("loginPanel");
const loadingPanel = document.getElementById("loadingPanel");
const formPanel = document.getElementById("formPanel");
const statusPanel = document.getElementById("applicationStatusPanel");
const applicationForm = document.getElementById("betaApplicationForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");

let currentUser = null;
let approvedCount = null;

async function loadAvailability() {
  const { count, error } = await supabaseClient
    .from("beta_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");

  if (error) {
    console.warn("Beta availability query error:", error);
    availabilityCount.textContent = "Limited to 50";
    availabilityMessage.textContent = "Places are limited. Sign in to see whether you can apply.";
    return;
  }

  approvedCount = count || 0;
  const remaining = Math.max(BETA_LIMIT - approvedCount, 0);
  availabilityCount.textContent = `${remaining} of ${BETA_LIMIT} spots remaining`;

  if (remaining === 0) {
    availabilityCard.classList.add("full");
    availabilityMessage.textContent = "All Founding Beta Tester places are currently filled.";
  } else {
    availabilityMessage.textContent = "Selected testers receive FREE Lifetime PRO access.";
  }
}

async function loadPage() {
  await loadAvailability();

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) {
    loadingPanel.hidden = true;
    loginPanel.hidden = false;
    return;
  }

  currentUser = user;
  document.getElementById("email").value = user.email || "";
  document.getElementById("fullName").value = user.user_metadata?.full_name || "";

  const { data: application, error: applicationError } = await supabaseClient
    .from("beta_applications")
    .select("id, status, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  loadingPanel.hidden = true;

  if (applicationError) {
    console.error("Beta application query error:", applicationError);
    showFormMessage("We could not check your application status. Please try again shortly.");
    formPanel.hidden = false;
    return;
  }

  if (application) {
    showApplicationStatus(application);
    return;
  }

  if (approvedCount === 0 || approvedCount === null || approvedCount < BETA_LIMIT) {
    formPanel.hidden = false;
  } else {
    showFullStatus();
  }
}

function showApplicationStatus(application) {
  const status = String(application.status || "pending").toLowerCase();
  const copy = {
    pending: ["PENDING REVIEW", "Your Founding Beta Tester application is pending review."],
    approved: ["APPROVED", "You're a Founding Beta Tester! Lifetime PRO access has been activated."],
    waitlisted: ["WAITLISTED", "The 50 Founding Beta Tester positions are currently full. Your application has been placed on the waitlist."],
    rejected: ["NOT SELECTED", "Thank you for your interest. This beta application was not selected at this time."]
  }[status] || ["APPLICATION RECEIVED", "Your application is being reviewed."];

  const badge = document.getElementById("statusBadge");
  badge.className = `status-badge ${["pending", "approved", "waitlisted", "rejected"].includes(status) ? status : "pending"}`;
  badge.textContent = copy[0];
  document.getElementById("statusTitle").textContent = status === "approved" ? "You are a Founding Beta Tester" : "Beta Tester Application";
  document.getElementById("statusDescription").textContent = copy[1];
  document.getElementById("submittedOn").textContent = application.submitted_at ? `Applied ${formatDate(application.submitted_at)}.` : "";
  statusPanel.hidden = false;
}

function showFullStatus() {
  document.getElementById("statusBadge").className = "status-badge waitlisted";
  document.getElementById("statusBadge").textContent = "APPLICATIONS PAUSED";
  document.getElementById("statusTitle").textContent = "All 50 places are filled";
  document.getElementById("statusDescription").textContent = "The Founding Beta Tester program is at capacity. Please check back for future opportunities.";
  statusPanel.hidden = false;
}

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!currentUser) {
    showFormMessage("Please sign in before submitting an application.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SUBMITTING…";

  const application = {
    user_id: currentUser.id,
    full_name: document.getElementById("fullName").value.trim(),
    email: currentUser.email,
    rank: document.getElementById("rank").value.trim(),
    vessel_type: document.getElementById("vesselType").value.trim(),
    feedback_interest: document.getElementById("testingInterests").value.trim(),
    notes: document.getElementById("notes").value.trim() || null
  };

  try {
    const { data: existingApplication, error: existingError } = await supabaseClient
      .from("beta_applications")
      .select("id, status, submitted_at")
      .eq("user_id", currentUser.id)
      .limit(1)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingApplication) {
      formPanel.hidden = true;
      showApplicationStatus(existingApplication);
      return;
    }

    const { data, error } = await supabaseClient
      .from("beta_applications")
      .insert(application)
      .select("id, status, submitted_at")
      .single();

    if (error) throw error;
    formPanel.hidden = true;
    showApplicationStatus(data);
  } catch (error) {
    console.error("Beta application submission error:", error);
    showFormMessage(error.code === "23505" ? "You have already submitted a beta application." : error.message || "We could not submit your application. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "SUBMIT BETA APPLICATION";
  }
});

function showFormMessage(text) { formMessage.textContent = text; }
function formatDate(value) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); }

loadPage();
