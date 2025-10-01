# 🚚 **Courier Delivery Cost & Time Estimator**
## Overview
This project provides a robust solution for the Courier Delivery Logistics challenge. It is a command-line interface (CLI) application designed to perform two core functions:

Cost Estimation (Problem 1): Calculate the final delivery cost (including discounts) for a batch of packages.

Time Estimation (Problem 2): Determine the optimal vehicle schedule and calculate the estimated delivery time for every package, based on a multi-criteria optimization strategy.

The solution is developed using Test-Driven Development (TDD) principles and adheres to Object-Oriented Programming (OOP) for high maintainability and testability.

## 🌟 Key Features
Multi-Criteria Optimization: The scheduling algorithm prioritizes package loading based on a three-tier hierarchy:

Maximize Package Count (↑ Count)

Maximize Total Weight (↑ Weight)

Minimize Delivery Time (↓ Distance)

Dynamic Vehicle Scheduling: Tracks the real-time availability of multiple vehicles to ensure the next trip is always started by the soonest-available vehicle.

Cost Calculation: Accurately calculates base cost, validates multiple offer codes, and applies discounts.

Input Validation: Robust error handling for non-numeric, non-positive, and missing data inputs.

Coding partner
That's an excellent list of assumptions! Explicitly stating these helps clarify the application's boundaries for any user or future developer.

Here is the revised README template incorporating your assumptions, followed by a list of additional technical and domain assumptions we made during the implementation process.

## 🧐 Assumptions & Constraints
The following assumptions were made regarding the input, output, and delivery model:

### Input & Data Assumptions

Optional Offer Code	If the OFFER_CODE column is empty, no discount is applied, and the package is processed normally.

Input Spacing	Multiple spaces between input tokens (e.g., PKG1  50 30) are treated as a single delimiter and do not affect parsing.

Empty/Invalid Lines	Empty lines in the input file will be ignored. Invalid package lines are skipped, with an error message logged, allowing valid packages to proceed.

Input Validation (Numerics)	baseCost, weight, distance, numVehicles, maxSpeed, and maxLoad must be positive numbers (i.e., >0). NO_OF_PACKAGES and NO_OF_VEHICLES must be integers greater than 0.

### Scheduling & Delivery Model Assumptions

Delivery Time Rounding	The final DELIVERY_TIME is rounded to 2 decimal places for display purposes only. All intermediate time and distance calculations use floating-point precision. (This causes slight variance in the output shown in the Problem Statement)

Delivery Route	All packages in a single trip are delivered sequentially, and the delivery vehicle returns to the hub only after all packages in that trip are delivered.

Trip Distance (RTD)	The return trip distance is 2× (Maximum Distance of any package in the trip).

Load Weight	Package weight is fixed and does not decrease after delivery. The total load capacity check is performed only at the start of the trip.

Delivery Strategy	The optimal loading strategy focuses only on the three explicit criteria (↑ Count →↑ Weight →↓ Distance). Any further tie-breaking (e.g., package ID order) simply selects the first candidate found.

## 🛠️ Tech Stack
Language: JavaScript (Node.js)

Testing Framework: Jest

Development Methodology: Test-Driven Development (TDD)

## 🚀 Getting Started
Prerequisites
You need to have Node.js and pnpm installed on your system.

Installation
### Clone the repository:

```
git clone https://github.com/dhyey178/courier-service.git
cd courier-service
```
### Install dependencies (Jest):
```
pnpm install
```

## 📝 Usage
The application is run via a single CLI command, piping the input from a text file containing all the necessary data.

Input Format
The input must consist of the following lines, in order:

Line(s)	Format	Description
1	**BASE_COST NO_OF_PACKAGES**:	Base delivery cost and total number of packages.
2 to N	**PKG_ID WEIGHT_KG DISTANCE_KM OFFER_CODE**:	Details for each package.
N+1	**NO_OF_VEHICLES MAX_SPEED MAX_LOAD**:	Vehicle parameters (required for scheduling).

Example Input 
```
100 5
PKG1 50 30 OFR003
PKG2 75 125 OFR000
PKG3 175 100 OFR002
PKG4 110 60 OFR001
PKG5 155 95 OFR000
2 70 200
```
## Running the Application
Execute the application using Node.js and pipe your input file:

```
node .\src\main.js
```
Output Format
The application outputs a list of processed packages, sorted by input order, , with the final four calculated values:


**PKG_ID DISCOUNT TOTAL_COST DELIVERY_TIME**
Example Output:

```
PKG1 5 1745 4.00
PKG2 0 1625 1.79
PKG3 350 1400 1.43
PKG4 150 1450 1.79
PKG5 0 2300 4.21
```
(Note: Output values are based on the internal logic derived during development.)

## 🧪 Running Tests
To ensure code quality and adherence to specifications, all core logic is covered by unit and integration tests.

```
pnpm test
```
