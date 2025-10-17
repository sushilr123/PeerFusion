import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/api";
import { Heart, Users, MessageCircle, TrendingUp, Loader2 } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and activity in parallel
      const [statsResponse, activityResponse] = await Promise.all([
        userService.getDashboardStats(),
        userService.getRecentActivity(),
      ]);

      // Create stats array with real data
      const statsData = [
        {
          icon: Heart,
          label: "Matches",
          value: statsResponse.data.matches.toString(),
          color: "var(--primary-color)",
        },
        {
          icon: Users,
          label: "Connections",
          value: statsResponse.data.connections.toString(),
          color: "var(--success-color)",
        },
        {
          icon: MessageCircle,
          label: "Messages",
          value: statsResponse.data.messages.toString(),
          color: "var(--info-color)",
        },
        {
          icon: TrendingUp,
          label: "Profile Views",
          value: statsResponse.data.profileViews.toString(),
          color: "var(--warning-color)",
        },
      ];

      setStats(statsData);
      setActivities(activityResponse.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading-state">
            <Loader2 className="spinner" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.firstName}! 👋</h1>
          <p>Ready to make some new connections today?</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: stat.color }}
                >
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-content">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-cards">
              <div className="action-card">
                <Heart />
                <h3>Discover Developers</h3>
                <p>Find new developers to connect with</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/feed")}
                >
                  Start Swiping
                </button>
              </div>
              <div className="action-card">
                <MessageCircle />
                <h3>Check Messages</h3>
                <p>See your latest conversations</p>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/chat")}
                >
                  View Chats
                </button>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {activities.length === 0 ? (
                <p className="no-activity">No recent activity to show</p>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <img
                      src={
                        activity.user.photoUrl ||
                        "https://via.placeholder.com/40"
                      }
                      alt={`${activity.user.firstName} ${activity.user.lastName}`}
                      className="activity-avatar"
                    />
                    <div className="activity-content">
                      <p>
                        <strong>
                          {activity.user.firstName} {activity.user.lastName}
                        </strong>{" "}
                        {activity.activity}
                      </p>
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
