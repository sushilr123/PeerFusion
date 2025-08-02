import { useState, useEffect } from "react";
import { userService, connectionService } from "../services/api";
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  RotateCcw,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Feed.css";

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError("");
      const feedData = await userService.getFeed();
      setUsers(feedData.data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching feed:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    try {
      setActionLoading(true);
      const status = action === "like" ? "interested" : "ignored";

      await connectionService.sendRequest(status, userId);

      const actionText = action === "like" ? "liked" : "passed";
      setShowSuccessMessage(`You ${actionText} this profile!`);

      // Move to next user
      setCurrentIndex((prev) => prev + 1);

      // Clear success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      setError(error.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentUser = users[currentIndex];
  const hasMoreUsers = currentIndex < users.length - 1;
  const hasPreviousUsers = currentIndex > 0;

  if (loading) {
    return (
      <div className="feed-loading">
        <Loader className="spinner" size={40} />
        <p>Finding amazing developers for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <div className="error-content">
          <X size={48} className="error-icon" />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchFeed} className="btn btn-primary">
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="feed-empty">
        <div className="empty-content">
          <Users size={64} className="empty-icon" />
          <h3>No more users to discover</h3>
          <p>
            You've seen all available profiles. Check back later for new
            developers!
          </p>
          <button onClick={fetchFeed} className="btn btn-primary">
            <RotateCcw size={16} />
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="feed-complete">
        <div className="complete-content">
          <Heart size={64} className="complete-icon" />
          <h3>You've seen everyone!</h3>
          <p>
            Great job exploring! Check back later for new profiles or review
            your connections.
          </p>
          <div className="complete-actions">
            <button onClick={fetchFeed} className="btn btn-primary">
              <RotateCcw size={16} />
              Load More
            </button>
            <button
              onClick={() => setCurrentIndex(0)}
              className="btn btn-outline"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Discover Developers</h1>
        <div className="feed-counter">
          {currentIndex + 1} of {users.length}
        </div>
      </div>

      {showSuccessMessage && (
        <div className="success-message">{showSuccessMessage}</div>
      )}

      <div className="feed-content">
        <div className="user-card">
          <div className="card-header">
            <div className="user-avatar">
              <img
                src={currentUser.photoUrl || "https://via.placeholder.com/120"}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
            </div>
            <div className="user-basic-info">
              <h2 className="user-name">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <div className="user-details">
                {currentUser.age && (
                  <span className="user-detail">
                    <Calendar size={14} />
                    {currentUser.age} years old
                  </span>
                )}
                {currentUser.gender && (
                  <span className="user-detail">
                    <Users size={14} />
                    {currentUser.gender}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card-body">
            {currentUser.about && (
              <div className="about-section">
                <h3>About</h3>
                <p>{currentUser.about}</p>
              </div>
            )}

            {currentUser.skills && currentUser.skills.length > 0 && (
              <div className="skills-section">
                <h3>Skills</h3>
                <div className="skills-tags">
                  {(Array.isArray(currentUser.skills)
                    ? currentUser.skills
                    : [currentUser.skills]
                  ).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      <Briefcase size={12} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-actions">
            <button
              onClick={() => handleAction("pass", currentUser._id)}
              disabled={actionLoading}
              className="action-btn pass-btn"
              title="Pass"
            >
              <X size={24} />
            </button>

            <div className="navigation-controls">
              <button
                onClick={handlePrevious}
                disabled={!hasPreviousUsers}
                className="nav-btn"
                title="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                disabled={!hasMoreUsers}
                className="nav-btn"
                title="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={() => handleAction("like", currentUser._id)}
              disabled={actionLoading}
              className="action-btn like-btn"
              title="Like"
            >
              <Heart size={24} />
            </button>
          </div>

          {actionLoading && (
            <div className="action-loading">
              <Loader className="spinner" size={20} />
              Processing...
            </div>
          )}
        </div>

        <div className="feed-instructions">
          <div className="instruction">
            <X size={16} className="pass-color" />
            <span>Pass</span>
          </div>
          <div className="instruction">
            <Heart size={16} className="like-color" />
            <span>Like</span>
          </div>
        </div>
      </div>

      <div className="feed-footer">
        <p>
          Found someone interesting? Like their profile to send a connection
          request!
        </p>
      </div>
    </div>
  );
};

export default Feed;
