import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  MessageCircle,
  Shield,
  Code,
  Coffee,
} from "lucide-react";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Find Your Perfect
                <span className="text-gradient"> Dev Match</span>
              </h1>
              <p className="hero-subtitle">
                Connect with passionate developers around the world. Share code,
                collaborate on projects, and build meaningful relationships in
                the tech community.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Start Matching
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Developers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5K+</span>
                  <span className="stat-label">Matches</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Countries</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="dev-cards">
                <div className="dev-card">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Developer"
                  />
                  <div className="dev-info">
                    <h4>Alex</h4>
                    <p>React Developer</p>
                    <div className="skills">
                      <span>React</span>
                      <span>Node.js</span>
                    </div>
                  </div>
                </div>
                <div className="dev-card">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b5c0?w=150&h=150&fit=crop&crop=face"
                    alt="Developer"
                  />
                  <div className="dev-info">
                    <h4>Sarah</h4>
                    <p>Full Stack Developer</p>
                    <div className="skills">
                      <span>Python</span>
                      <span>Django</span>
                    </div>
                  </div>
                </div>
                <div className="dev-card">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Developer"
                  />
                  <div className="dev-info">
                    <h4>Mike</h4>
                    <p>DevOps Engineer</p>
                    <div className="skills">
                      <span>AWS</span>
                      <span>Docker</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why PeerFusion?</h2>
            <p>
              The perfect platform for developers to connect and collaborate
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3>Smart Matching</h3>
              <p>
                Our algorithm matches you with developers based on skills,
                interests, and location preferences.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Code />
              </div>
              <h3>Skill-Based Profiles</h3>
              <p>
                Showcase your technical skills, projects, and experience to
                attract the right connections.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MessageCircle />
              </div>
              <h3>Real-time Chat</h3>
              <p>
                Connect instantly with your matches through our secure,
                real-time messaging system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Community Driven</h3>
              <p>
                Join a growing community of passionate developers from around
                the world.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Safe & Secure</h3>
              <p>
                Your privacy and security are our top priorities with end-to-end
                encryption.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Coffee />
              </div>
              <h3>Casual & Professional</h3>
              <p>
                Whether you're looking for collaboration partners or coding
                buddies, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Profile</h3>
                <p>
                  Add your skills, experience, and what you're looking for in a
                  connection.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Discover Developers</h3>
                <p>
                  Browse through profiles and connect with developers who match
                  your interests.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Collaborating</h3>
                <p>Chat, share ideas, and work together on amazing projects.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Dev Match?</h2>
            <p>
              Join thousands of developers who have already found their perfect
              collaboration partners.
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Heart />
              <span>PeerFusion</span>
            </div>
            <p>&copy; 2024 PeerFusion. Made with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
