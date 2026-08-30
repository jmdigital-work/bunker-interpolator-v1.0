const ids = [
  "trimLow", "trimTarget", "trimHigh",
  "depthLow", "depthTarget", "depthHigh",
  "v11", "v13", "v31", "v33"
];

const $ = (id) => document.getElementById(id);

function number(id) {
  return parseFloat($(id).value);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function calculate() {
  const tl = number("trimLow");
  const tt = number("trimTarget");
  const th = number("trimHigh");

  const dl = number("depthLow");
  const dt = number("depthTarget");
  const dh = number("depthHigh");

  const v11 = number("v11");
  const v13 = number("v13");
  const v31 = number("v31");
  const v33 = number("v33");

  const values = [tl, tt, th, dl, dt, dh, v11, v13, v31, v33];

  if (values.some((v) => !Number.isFinite(v))) {
    alert("Please complete all white and light-blue cells.");
    return;
  }

  if (tl === th || dl === dh) {
    alert("Lower and upper Trim/Ullage values must be different.");
    return;
  }

  const tx = (tt - tl) / (th - tl);
  const dy = (dt - dl) / (dh - dl);

  // Bilinear interpolation.
  const top = lerp(v11, v13, tx);
  const bottom = lerp(v31, v33, tx);
  const target = lerp(top, bottom, dy);

  // The five interpolated cells shown in the reference design.
  setResult("r12", top);
  setResult("r21", lerp(v11, v31, dy));
  setResult("r22", target);
  setResult("r23", lerp(v13, v33, dy));
  setResult("r32", bottom);
}

function setResult(id, value) {
  $(id).textContent = Number(value).toFixed(2);
}

function clearAll() {
  $("trimLow").value = "";
  $("trimTarget").value = "";
  $("trimHigh").value = "";

  $("depthLow").value = "";
  $("depthTarget").value = "";
  $("depthHigh").value = "";

  $("v11").value = "";
  $("v13").value = "";
  $("v31").value = "";
  $("v33").value = "";

  ["r12", "r21", "r22", "r23", "r32"].forEach((id) => {
    $(id).textContent = "";
  });
}

$("calculate").addEventListener("click", calculate);
$("clear").addEventListener("click", clearAll);

// Show the example calculation immediately, matching the reference image.
calculate();
