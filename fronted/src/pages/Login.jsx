import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { validateEmail, getErrorMessage } from "../utils/helpers";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!validateEmail(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        submit: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Heart className="logo-icon" />
            <span>PeerFusion</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to find your perfect dev match</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="form-group">
            <label htmlFor="emailId" className="form-label">
              Email Address
            </label>
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                className={`form-input ${errors.emailId ? "error" : ""}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.emailId && (
              <span className="form-error">{errors.emailId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-background">
        <div className="floating-card">
          <div className="card-avatar">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
              alt="Developer"
            />
          </div>
          <h4>Mike Chen</h4>
          <p>Full Stack Developer</p>
          <div className="card-skills">
            <span>React</span>
            <span>Node.js</span>
          </div>
        </div>

        <div className="floating-card">
          <div className="card-avatar">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b5c0?w=60&h=60&fit=crop&crop=face"
              alt="Developer"
            />
          </div>
          <h4>Sarah Wilson</h4>
          <p>UI/UX Designer</p>
          <div className="card-skills">
            <span>Figma</span>
            <span>CSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
