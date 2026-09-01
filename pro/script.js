/* =========================================================
   MARINECALC PRO
   MANUAL ACTIVATION — V1
   ========================================================= */


/* =========================================================
   PAYMENT TABS
   ========================================================= */

const paymentTabs =
  document.querySelectorAll(".payment-tab");

const instapaySection =
  document.getElementById("instapaySection");

const paypalSection =
  document.getElementById("paypalSection");


paymentTabs.forEach((tab) => {

  tab.addEventListener(
    "click",
    () => {

      paymentTabs.forEach((item) => {

        item.classList.remove("active");

      });


      tab.classList.add("active");


      const payment =
        tab.dataset.payment;


      if (payment === "instapay") {

        instapaySection.classList.add("active");

        paypalSection.classList.remove("active");

      }


      if (payment === "paypal") {

        paypalSection.classList.add("active");

        instapaySection.classList.remove("active");

      }

    }
  );

});


/* =========================================================
   PAYMENT FORM
   ========================================================= */

const paymentForm =
  document.getElementById("paymentForm");

const successMessage =
  document.getElementById("successMessage");


paymentForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    /*
      Get form data.

      At this stage we are NOT sending
      it to a server yet.
    */

    const formData =
      new FormData(paymentForm);


    const name =
      formData.get("name");

    const email =
      formData.get("email");

    const paymentMethod =
      formData.get("paymentMethod");

    const paymentReference =
      formData.get("paymentReference");

    const paymentDate =
      formData.get("paymentDate");


    /*
      Basic validation
    */

    if (
      !name ||
      !email ||
      !paymentMethod ||
      !paymentReference ||
      !paymentDate
    ) {

      alert(
        "Please complete all required payment information."
      );

      return;

    }


    /*
      Show confirmation.

      IMPORTANT:
      This does NOT activate PRO.

      It only confirms that the request
      has been recorded locally for now.
    */

    paymentForm.hidden = true;

    successMessage.hidden = false;


    /*
      For development/testing only.

      We store the submission locally so
      you can inspect it in the browser.

      This will later be replaced with
      a real backend/database submission.
    */

    const submission = {

      name: name,

      email: email,

      paymentMethod: paymentMethod,

      paymentReference: paymentReference,

      paymentDate: paymentDate,

      submittedAt:
        new Date().toISOString()

    };


    localStorage.setItem(
      "marinecalcProPaymentRequest",
      JSON.stringify(submission)
    );

  }
);


/* =========================================================
   PAYPAL LINK
   ========================================================= */

/*
  Replace this with your actual PayPal
  payment link when ready.

  Example:

  https://www.paypal.me/YourPayPalName/9
*/

const paypalButton =
  document.getElementById("paypalButton");


paypalButton.addEventListener(
  "click",
  function (event) {

    /*
      Prevent the placeholder link from
      doing anything until your actual
      PayPal link is inserted.
    */

    if (
      paypalButton.getAttribute("href") === "#"
    ) {

      event.preventDefault();

      alert(
        "PayPal payment link has not been configured yet."
      );

    }

  }
);


/* =========================================================
   PAYMENT METHOD AUTO-SELECTION
   ========================================================= */

const paymentMethod =
  document.getElementById("paymentMethod");


paymentTabs.forEach((tab) => {

  tab.addEventListener(
    "click",
    () => {

      if (
        tab.dataset.payment === "instapay"
      ) {

        paymentMethod.value =
          "InstaPay";

      }


      if (
        tab.dataset.payment === "paypal"
      ) {

        paymentMethod.value =
          "PayPal";

      }

    }
  );

});