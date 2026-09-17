import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { BusinessHome } from "./pages/BusinessHome";
import { Recipients } from "./pages/Recipients";
import { AddRecipient } from "./pages/AddRecipient";
import { RecipientDetail } from "./pages/RecipientDetail";
import { PaymentForm } from "./pages/PaymentForm";
import { ReviewPayment } from "./pages/ReviewPayment";
import { AuthorisePayment } from "./pages/AuthorisePayment";
import { PaymentStatus } from "./pages/PaymentStatus";
import { History } from "./pages/History";
import { SharedStatus } from "./pages/SharedStatus";
import { DemoControlPanel } from "./pages/DemoControlPanel";
import { Research } from "./pages/Research";
import { Metrics } from "./pages/Metrics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/business" replace />} />
        
        {/* App Shell with Nav */}
        <Route element={<Layout />}>
          <Route path="/business" element={<BusinessHome />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/history" element={<History />} />
          <Route path="/demo" element={<DemoControlPanel />} />
        </Route>

        {/* Full screen pages without bottom nav */}
        <Route element={<Layout hideNav />}>
          <Route path="/recipients/new" element={<AddRecipient />} />
          <Route path="/recipients/:id" element={<RecipientDetail />} />
          <Route path="/pay/:recipientId" element={<PaymentForm />} />
          <Route path="/review/:draftId" element={<ReviewPayment />} />
          <Route path="/authorise/:draftId" element={<AuthorisePayment />} />
          <Route path="/payments/:id" element={<PaymentStatus />} />
          <Route path="/research" element={<Research />} />
          <Route path="/metrics" element={<Metrics />} />
        </Route>

        {/* Standalone pages */}
        <Route path="/r/:token" element={<SharedStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
