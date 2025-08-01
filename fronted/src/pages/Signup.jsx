import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Heart, Mail, Lock, User, Calendar, Eye, EyeOff } from "lucide-react";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateAge,
  getErrorMessage,
} from "../utils/helpers";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
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

    if (!validateName(formData.firstName)) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!validateEmail(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (!validateAge(parseInt(formData.age))) {
      newErrors.age = "Age must be between 18 and 100";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
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
      const signupData = {
        ...formData,
        age: parseInt(formData.age),
      };
      await signup(signupData);
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
          <h1>Join PeerFusion</h1>
          <p>Create your profile and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? "error" : ""}`}
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              {errors.firstName && (
                <span className="form-error">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

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
                placeholder="john@example.com"
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
                placeholder="Create a strong password"
                autoComplete="new-password"
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <div className="input-group">
                <Calendar className="input-icon" />
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`form-input ${errors.age ? "error" : ""}`}
                  placeholder="25"
                  min="18"
                  max="100"
                />
              </div>
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-input ${errors.gender ? "error" : ""}`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="form-error">{errors.gender}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-background">
        <div className="floating-card">
          <div className="card-avatar">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
              alt="Developer"
            />
          </div>
          <h4>Alex Kumar</h4>
          <p>Frontend Developer</p>
          <div className="card-skills">
            <span>React</span>
            <span>TypeScript</span>
          </div>
        </div>

        <div className="floating-card">
          <div className="card-avatar">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face"
              alt="Developer"
            />
          </div>
          <h4>Emma Davis</h4>
          <p>Backend Developer</p>
          <div className="card-skills">
            <span>Python</span>
            <span>Django</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
