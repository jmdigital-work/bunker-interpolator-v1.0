# MarineCalc V1.0 — Progressive Web App

MarineCalc is a mobile-first Progressive Web App (PWA) designed for marine engineers and shipboard use.

It provides practical calculation tools that can be accessed from a web browser and installed on supported devices as an app.

## Current Calculators

### 🛢️ Bunker Interpolator

**FREE**

Interpolates bunker tank volume from:

- Trim
- Ullage / depth
- Tank sounding table data

This calculator is intended for quick shipboard bunker quantity interpolation.

### ⛽ Bunker (MT) Calculator

**PRO**

A standalone simplified shipboard calculator for converting known bunker volume into metric tonnes.

Calculation flow:

**Actual Volume → Temperature-Corrected Density → Bunker Mass**

Inputs include:

- Fuel type
- Actual volume
- Density @ 15°C
- Fuel temperature
- Correction coefficient

The default correction coefficient is **0.00064** and remains editable.

### 🕛 Noon Calculation

**PRO**

Shipboard noon calculation tool covering:

- Main shaft total revolution
- Average RPM
- Propeller constant
- Propeller distance
- Propeller speed
- LOG speed
- OG speed
- Slip by LOG distance
- Slip by OG distance
- Slip by LOG speed
- Slip by OG speed

The calculator allows manual entry of Propeller ConstantREV and Propeller Distance where required.

## FREE and PRO Access

MarineCalc follows a free + paid model.

### FREE

The Bunker Interpolator is available for free.

### PRO

PRO calculators are intended to be unlocked through MarineCalc PRO access.

The initial commercial model will use a **one-time Lifetime purchase**.

Subscription billing may be introduced later.

## Project Structure

```text
MarineCalc
│
├── calculators/
│   ├── bunker-interpolator/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   │
│   ├── bunker-mt/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   │
│   └── noon-calculation/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
├── icons/
├── index.html
├── manifest.webmanifest
├── style.css
├── sw.js
└── README.md