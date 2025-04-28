import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Success from './components/Success';
import RegisterForm from './components/RegisterForm';
import TermsAndConditions from './components/TermsAndConditions';
import RefundAndCancellation from './components/RefundAndCancellation';
import RazorpayPrivacyPolicy from './components/RazorpayPrivacyPolicy';
import Profile from './components/Profile';
import AuthFlowHandler from './components/auth/AuthFlowHandler';
import Instructors from './components/Instructors';
import Courses from './components/Courses';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import Contact from './components/Contact'; // Fixed capitalization

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Loader loading={isLoading} size="small" />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <div className="font-poppins">
              <Navbar />
              <Hero />
              <About />
              <Features />
              <Instructors />
              <Courses />
              <Pricing />
              <Testimonials />
              <RegisterForm />
              <Contact />
              <Footer />
            </div>
          } />
          {/* Update the register route to use AuthFlowHandler */}
          <Route path="/register" element={
            <>
              <Navbar />
              <AuthFlowHandler />
              <Footer />
            </>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/TermsandConditions" element={<TermsAndConditions />} />
          <Route path="/RefundandCancellation" element={<RefundAndCancellation />} />
          <Route path="/privacypolicy" element={<RazorpayPrivacyPolicy />} />
          <Route path="/success" element={<Success />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;