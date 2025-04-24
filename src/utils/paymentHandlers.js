// src/utils/paymentHandlers.js

/**
 * Sets the payment as successful and redirects to the success page
 * @param {string} referenceId - The payment reference ID
 * @param {object} userData - Optional user data to store
 */
export const handlePaymentSuccess = (referenceId, userData = null) => {
    try {
      // Store the payment success flag
      sessionStorage.setItem('paymentSuccessful', 'true');
      
      // Store the reference ID
      sessionStorage.setItem('referenceId', referenceId);
      localStorage.setItem('referenceId', referenceId);
      
      // Store user data if provided
      if (userData) {
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }
      
      // Log for debugging
      console.log("Payment success data stored, redirecting to success page...");
      
      // Navigate to success page with reference ID
      // Use a small timeout to ensure storage is complete before navigation
      setTimeout(() => {
        window.location.href = `/success?refId=${encodeURIComponent(referenceId)}`;
      }, 500); // Increased timeout to ensure storage is complete
    } catch (error) {
      console.error("Error handling payment success:", error);
      
      // Still try to set the important flags even if there was an error
      try {
        sessionStorage.setItem('paymentSuccessful', 'true');
        sessionStorage.setItem('referenceId', referenceId);
      } catch (e) {
        console.error("Critical error storing payment data:", e);
      }
      
      // Fallback direct navigation
      window.location.href = `/success?refId=${encodeURIComponent(referenceId)}`;
    }
  };
  
  /**
   * Clears payment success data
   */
  export const clearPaymentData = () => {
    try {
      sessionStorage.removeItem('paymentSuccessful');
      sessionStorage.removeItem('referenceId');
      sessionStorage.removeItem('userData');
      // Don't remove from localStorage as it might be needed for order history
      console.log("Payment data cleared successfully");
    } catch (error) {
      console.error("Error clearing payment data:", error);
    }
  };