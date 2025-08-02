import { useState, useEffect } from "react";
import { paymentService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  Crown,
  Check,
  Star,
  Heart,
  MessageCircle,
  Users,
  Zap,
  Shield,
  Loader,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./Premium.css";

const Premium = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("gold");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = {
    silver: {
      name: "Silver",
      price: 300,
      duration: "1 Month",
      features: [
        "Unlimited swipes",
        "See who liked you",
        "Priority in feed",
        "Advanced filters",
        "Read receipts in chat",
      ],
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)",
      popular: false,
    },
    gold: {
      name: "Gold",
      price: 700,
      duration: "3 Months",
      features: [
        "All Silver features",
        "Boost your profile 3x daily",
        "Super likes (5 per day)",
        "Rewind last swipe",
        "Incognito mode",
        "Priority customer support",
        "Profile analytics",
      ],
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      popular: true,
    },
  };

  useEffect(() => {
    verifyPremiumStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const verifyPremiumStatus = async () => {
    try {
      setVerifyLoading(true);
      const response = await paymentService.verifyPremium();
      if (response.isPremium !== user?.isPremium) {
        refreshUser();
      }
    } catch (error) {
      console.error("Error verifying premium status:", error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (membershipType) => {
    try {
      setLoading(true);
      setPaymentError("");

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setPaymentError("Failed to load payment gateway. Please try again.");
        return;
      }

      // Create payment order
      const paymentData = await paymentService.createPayment({
        membershipType,
      });

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "PeerFusion Premium",
        description: `${plans[membershipType].name} Membership - ${plans[membershipType].duration}`,
        order_id: paymentData.orderId,
        theme: {
          color: "#6366f1",
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.emailId,
        },
        handler: async (response) => {
          try {
            console.log("Payment successful:", response);
            setPaymentSuccess(true);
            
            // Refresh user data to get updated premium status
            setTimeout(() => {
              refreshUser();
              verifyPremiumStatus();
            }, 2000);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
              setPaymentSuccess(false);
            }, 5000);
          } catch (error) {
            console.error("Error after payment:", error);
            setPaymentError("Payment completed but verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentError("Payment was cancelled. Please try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error.response?.data?.msg || "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="premium-container">
        <div className="premium-active">
          <div className="premium-crown">
            <Crown size={80} className="crown-icon" />
          </div>
          <h1>You're Premium!</h1>
          <p>Enjoy all the exclusive features</p>
          
          <div className="premium-benefits">
            <h3>Active Premium Features:</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <Heart className="benefit-icon" />
                <span>Unlimited Swipes</span>
              </div>
              <div className="benefit-item">
                <Users className="benefit-icon" />
                <span>See Who Liked You</span>
              </div>
              <div className="benefit-item">
                <Zap className="benefit-icon" />
                <span>Profile Boost</span>
              </div>
              <div className="benefit-item">
                <MessageCircle className="benefit-icon" />
                <span>Priority Support</span>
              </div>
              <div className="benefit-item">
                <Shield className="benefit-icon" />
                <span>Advanced Privacy</span>
              </div>
              <div className="benefit-item">
                <Star className="benefit-icon" />
                <span>Premium Badge</span>
              </div>
            </div>
          </div>

          <div className="membership-info">
            <div className="info-card">
              <Crown size={20} />
              <div>
                <span className="info-label">Membership Type</span>
                <span className="info-value">{user?.membershipType?.toUpperCase() || 'PREMIUM'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-header">
        <Crown className="header-crown" size={60} />
        <h1>Upgrade to Premium</h1>
        <p>Unlock exclusive features and supercharge your networking</p>
      </div>

      {verifyLoading && (
        <div className="verify-loading">
          <Loader className="spinner" size={20} />
          <span>Verifying premium status...</span>
        </div>
      )}

      {paymentSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          Payment successful! Welcome to Premium!
        </div>
      )}

      {paymentError && (
        <div className="error-message">
          <AlertCircle size={20} />
          {paymentError}
          <button onClick={() => setPaymentError("")} className="close-error">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="plans-container">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className={`plan-card ${selectedPlan === key ? "selected" : ""} ${
              plan.popular ? "popular" : ""
            }`}
            onClick={() => setSelectedPlan(key)}
          >
            {plan.popular && (
              <div className="popular-badge">
                <Star size={14} />
                Most Popular
              </div>
            )}

            <div className="plan-header">
              <div
                className="plan-icon"
                style={{ background: plan.gradient }}
              >
                <Crown size={24} color="white" />
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                ₹{plan.price}
                <span className="plan-duration">/{plan.duration}</span>
              </div>
            </div>

            <div className="plan-features">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <Check size={16} className="feature-check" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`plan-button ${selectedPlan === key ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePayment(key);
              }}
              disabled={loading}
            >
              {loading && selectedPlan === key ? (
                <>
                  <Loader className="spinner" size={16} />
                  Processing...
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Choose {plan.name}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="premium-benefits">
        <h2>Why Go Premium?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <Heart className="benefit-icon premium-gradient" />
            <h4>Unlimited Connections</h4>
            <p>Swipe and connect with unlimited developers without restrictions</p>
          </div>
          <div className="benefit-card">
            <Users className="benefit-icon premium-gradient" />
            <h4>See Who Liked You</h4>
            <p>Know exactly who's interested in connecting with you</p>
          </div>
          <div className="benefit-card">
            <Zap className="benefit-icon premium-gradient" />
            <h4>Profile Boost</h4>
            <p>Get 3x more visibility with daily profile boosts</p>
          </div>
          <div className="benefit-card">
            <MessageCircle className="benefit-icon premium-gradient" />
            <h4>Priority Support</h4>
            <p>Get premium customer support for any issues</p>
          </div>
          <div className="benefit-card">
            <Shield className="benefit-icon premium-gradient" />
            <h4>Advanced Privacy</h4>
            <p>Browse profiles anonymously with incognito mode</p>
          </div>
          <div className="benefit-card">
            <Star className="benefit-icon premium-gradient" />
            <h4>Exclusive Badge</h4>
            <p>Stand out with a premium badge on your profile</p>
          </div>
        </div>
      </div>

      <div className="premium-footer">
        <div className="security-info">
          <Shield size={20} />
          <div>
            <strong>Secure Payment</strong>
            <p>All payments are processed securely through Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
