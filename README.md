# Paytm Business Repeat Pay — Prototype

This is a high-fidelity coded prototype for the Paytm Innovation Challenge 2026 (Track B).

**IMPORTANT: THIS IS A DEMO ONLY. NO REAL MONEY MOVES. NO REAL UPI APIS ARE USED.**

## Product Concept
A lightweight business-payment space inside Paytm for small merchants who repeatedly make outgoing UPI payments to regular business contacts.

The core loop: **Organise → Pay → Add Context → Track → Prove → Repeat**

## Running the Prototype

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the provided local URL in your browser (preferably in mobile view or responsive mode).

## Features Implemented
- **Business Dashboard**: Shows frequent recipients and recent payments.
- **Recipient Management**: Add and search saved business contacts.
- **Pay Again Workflow**: Creates a new draft payment from an existing recipient *without* pre-filling the amount to prevent blind repeat mistakes.
- **Duplicate Protection Warning**: Warns if a similar payment was made recently.
- **Payment Reference**: Allows adding an optional purpose/reference to payments.
- **Simulated Payment States**: Supports SUCCESS, PENDING, FAILED, and REVERSED states.
- **Shareable Status**: A limited, recipient-facing status page to prove payment without exposing bank details or full history.
- **Demo Controls**: A hidden panel (`/demo`) to simulate different scenarios (e.g. pending resolving to success/failure, fee scenarios) during a presentation.

## Intentionally Simulated / Excluded Features
- **No Real UPI Integration**: Payments are simulated and stored in browser `localStorage`.
- **Fictional Bank Details**: Fake accounts and `@demo` UPI IDs are used.
- **No Real Verification**: Recipient validation is mocked.
- **No Real Auth**: PIN, OTP, and biometric steps are skipped to focus on the UX flow.
- **Simulated Fee Options**: A demo toggle for MDR/fee scenarios exists, but no official Paytm fee policy is claimed or implemented.

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- `lucide-react` for icons
- `date-fns` for time formatting
- `localStorage` as the mock database
