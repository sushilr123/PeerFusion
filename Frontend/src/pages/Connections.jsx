import { useState, useEffect } from "react";
import { userService, connectionService } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  Check,
  X,
  Clock,
  Heart,
  UserPlus,
  Loader,
  RefreshCcw,
  Calendar,
  Briefcase,
  Mail,
} from "lucide-react";
import "./Connections.css";

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("connections");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [connectionsData, requestsData] = await Promise.all([
        userService.getConnections(),
        userService.getReceivedRequests(),
      ]);

      setConnections(connectionsData.data || []);
      setPendingRequests(requestsData.data || []);
    } catch (error) {
      console.error("Error fetching connections data:", error);
      setError("Failed to load connections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (action, requestId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: true }));

      const status = action === "accept" ? "accepted" : "rejected";
      await connectionService.reviewRequest(status, requestId);

      // Remove the request from pending list
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));

      // If accepted, refresh connections to show the new connection
      if (action === "accept") {
        const connectionsData = await userService.getConnections();
        setConnections(connectionsData.data || []);
      }

      const actionText = action === "accept" ? "accepted" : "rejected";
      setShowSuccessMessage(`Connection request ${actionText}!`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setError(error.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleStartChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const renderUserCard = (
    userData,
    type = "connection",
    requestData = null
  ) => {
    const isConnection = type === "connection";
    const isPending = type === "pending";

    return (
      <div key={userData._id} className="user-card">
        <div className="user-card-header">
          <div className="user-avatar">
            <img
              src={userData.photoUrl || "https://via.placeholder.com/80"}
              alt={`${userData.firstName} ${userData.lastName}`}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80";
              }}
            />
          </div>
          <div className="user-info">
            <h3 className="user-name">
              {userData.firstName} {userData.lastName}
            </h3>
            <div className="user-details">
              {userData.age && (
                <span className="user-detail">
                  <Calendar size={12} />
                  {userData.age} years
                </span>
              )}
              {userData.gender && (
                <span className="user-detail">
                  <Users size={12} />
                  {userData.gender}
                </span>
              )}
            </div>
          </div>

          {isPending && (
            <div className="request-badge">
              <Clock size={14} />
              Pending
            </div>
          )}
        </div>

        <div className="user-card-body">
          {userData.about && <p className="user-about">{userData.about}</p>}

          {userData.skills && userData.skills.length > 0 && (
            <div className="user-skills">
              {(Array.isArray(userData.skills)
                ? userData.skills.slice(0, 3)
                : [userData.skills]
              ).map((skill, index) => (
                <span key={index} className="skill-tag">
                  <Briefcase size={10} />
                  {skill}
                </span>
              ))}
              {userData.skills.length > 3 && (
                <span className="more-skills">
                  +{userData.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="user-card-actions">
          {isConnection && (
            <button
              onClick={() => handleStartChat(userData._id)}
              className="btn btn-primary"
            >
              <MessageCircle size={16} />
              Chat
            </button>
          )}

          {isPending && (
            <div className="request-actions">
              <button
                onClick={() => handleRequestAction("reject", requestData._id)}
                disabled={actionLoading[requestData._id]}
                className="btn btn-outline btn-reject"
              >
                {actionLoading[requestData._id] ? (
                  <Loader size={16} className="spinner" />
                ) : (
                  <X size={16} />
                )}
                Reject
              </button>
              <button
                onClick={() => handleRequestAction("accept", requestData._id)}
                disabled={actionLoading[requestData._id]}
                className="btn btn-primary btn-accept"
              >
                {actionLoading[requestData._id] ? (
                  <Loader size={16} className="spinner" />
                ) : (
                  <Check size={16} />
                )}
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="connections-loading">
        <Loader className="spinner" size={40} />
        <p>Loading your connections...</p>
      </div>
    );
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h1>Your Network</h1>
        <p>Manage your connections and review pending requests</p>

        <button onClick={fetchData} className="refresh-btn" title="Refresh">
          <RefreshCcw size={16} />
        </button>
      </div>

      {showSuccessMessage && (
        <div className="success-message">{showSuccessMessage}</div>
      )}

      {error && (
        <div className="error-message">
          <X size={16} />
          {error}
          <button onClick={() => setError("")} className="close-error">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="connections-tabs">
        <button
          className={`tab ${activeTab === "connections" ? "active" : ""}`}
          onClick={() => setActiveTab("connections")}
        >
          <Users size={16} />
          Connections ({connections.length})
        </button>
        <button
          className={`tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <UserPlus size={16} />
          Pending Requests ({pendingRequests.length})
        </button>
      </div>

      <div className="connections-content">
        {activeTab === "connections" && (
          <div className="connections-section">
            {connections.length === 0 ? (
              <div className="empty-state">
                <Users size={64} className="empty-icon" />
                <h3>No connections yet</h3>
                <p>Start discovering developers to build your network!</p>
                <button
                  onClick={() => navigate("/feed")}
                  className="btn btn-primary"
                >
                  <Heart size={16} />
                  Discover People
                </button>
              </div>
            ) : (
              <div className="users-grid">
                {connections.map((connection) =>
                  renderUserCard(connection, "connection")
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="requests-section">
            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <Mail size={64} className="empty-icon" />
                <h3>No pending requests</h3>
                <p>
                  You're all caught up! New connection requests will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="users-grid">
                {pendingRequests.map((request) =>
                  renderUserCard(request.fromUserId, "pending", request)
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="connections-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-number">{connections.length}</span>
            <span className="stat-label">Connections</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-number">{pendingRequests.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
