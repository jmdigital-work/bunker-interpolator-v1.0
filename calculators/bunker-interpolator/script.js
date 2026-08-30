const ids = [
  "trimLow", "trimTarget", "trimHigh",
  "depthLow", "depthTarget", "depthHigh",
  "v11", "v13", "v31", "v33"
];

const $ = (id) => document.getElementById(id);

/*
  Read a numeric input.

  Blank input cells are treated as zero.
*/
function number(id) {
  const input = $(id);
  const value = input.value.trim();

  if (value === "") {
    return 0;
  }

  return parseFloat(value);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/*
  Make blank input cells visibly become 0.00.
*/
function fillBlankInputsWithZero() {
  ids.forEach((id) => {
    const input = $(id);

    if (input.value.trim() === "") {
      input.value = "0.00";
    }
  });
}

function calculate() {
  // Convert all blank blue/white cells to visible 0.00.
  fillBlankInputsWithZero();

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

  if (
    !Number.isFinite(tl) ||
    !Number.isFinite(tt) ||
    !Number.isFinite(th) ||
    !Number.isFinite(dl) ||
    !Number.isFinite(dt) ||
    !Number.isFinite(dh) ||
    !Number.isFinite(v11) ||
    !Number.isFinite(v13) ||
    !Number.isFinite(v31) ||
    !Number.isFinite(v33)
  ) {
    alert("Please enter valid numbers.");
    return;
  }

  if (tl === th) {
    alert("Lower and upper Trim values must be different.");
    return;
  }

  if (dl === dh) {
    alert("Lower and upper Ullage/Depth values must be different.");
    return;
  }

  const tx = (tt - tl) / (th - tl);
  const dy = (dt - dl) / (dh - dl);

  // Bilinear interpolation.
  const top = lerp(v11, v13, tx);
  const bottom = lerp(v31, v33, tx);
  const target = lerp(top, bottom, dy);

  // Display calculated values.
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
  ids.forEach((id) => {
    $(id).value = "";
  });

  ["r12", "r21", "r22", "r23", "r32"].forEach((id) => {
    $(id).textContent = "";
  });
}

$("calculate").addEventListener("click", calculate);
$("clear").addEventListener("click", clearAll);

// Show the example calculation immediately.
calculate();