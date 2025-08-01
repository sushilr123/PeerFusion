import { useAuth } from "../hooks/useAuth";
import { Heart, Users, MessageCircle, TrendingUp } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: Heart,
      label: "Matches",
      value: "12",
      color: "var(--primary-color)",
    },
    {
      icon: Users,
      label: "Connections",
      value: "8",
      color: "var(--success-color)",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      value: "24",
      color: "var(--info-color)",
    },
    {
      icon: TrendingUp,
      label: "Profile Views",
      value: "156",
      color: "var(--warning-color)",
    },
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.firstName}! 👋</h1>
          <p>Ready to make some new connections today?</p>
        </div>

        <div className="stats-grid">
          {stats.map(({ icon: IconComponent, label, value, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: color }}>
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <h3>{value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-cards">
              <div className="action-card">
                <Heart />
                <h3>Discover Developers</h3>
                <p>Find new developers to connect with</p>
                <button className="btn btn-primary">Start Swiping</button>
              </div>
              <div className="action-card">
                <MessageCircle />
                <h3>Check Messages</h3>
                <p>See your latest conversations</p>
                <button className="btn btn-outline">View Chats</button>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                />
                <div className="activity-content">
                  <p>
                    <strong>Alex Kumar</strong> sent you a connection request
                  </p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b5c0?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                />
                <div className="activity-content">
                  <p>
                    <strong>Sarah Wilson</strong> accepted your connection
                  </p>
                  <span>5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
