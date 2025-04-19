// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Coaches from './components/Coaches';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Success from './components/Success';
import RegisterForm from './components/RegisterForm';
import ContactUs from './components/ContactUs';
import TermsAndConditions from './components/TermsAndConditions';
import RefundAndCancellation from './components/RefundAndCancellation';
import RazorpayPrivacyPolicy from './components/RazorpayPrivacyPolicy';
import PaymentFailed from './components/PaymentFailed ';
import PaymentCallback from './components/PaymentCallback ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="font-poppins">
            <Navbar />
            <Hero />
            <About />
            <Features />
            <Coaches />
            <Testimonials />
            <Pricing />
            <RegisterForm />
            <Footer />
          </div>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <RegisterForm />
            <Footer />
          </>
        } />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/TermsandConditions" element={<TermsAndConditions />} />
        <Route path="/RefundandCancellation" element={<RefundAndCancellation />} />
        <Route path="/privacypolicy" element={<RazorpayPrivacyPolicy />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="/success" element={<Success />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;