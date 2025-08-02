import { useState, useEffect } from "react";
import { profileService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Users,
  Briefcase
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
    photoUrl: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setProfileData(profile);
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        emailId: profile.emailId || "",
        age: profile.age || "",
        gender: profile.gender || "",
        about: profile.about || "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
        photoUrl: profile.photoUrl || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Prepare data for API (convert skills back to array if needed)
      const updateData = {
        ...formData,
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill)
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === "" || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const updatedProfile = await profileService.updateProfile(updateData);
      setProfileData(updatedProfile);
      updateUser(updatedProfile); // Update auth context
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      emailId: profileData.emailId || "",
      age: profileData.age || "",
      gender: profileData.gender || "",
      about: profileData.about || "",
      skills: Array.isArray(profileData.skills) ? profileData.skills.join(", ") : profileData.skills || "",
      photoUrl: profileData.photoUrl || ""
    });
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-error">
        <p>Failed to load profile data</p>
        <button onClick={fetchProfile} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img
                src={isEditing ? formData.photoUrl || "https://via.placeholder.com/120" : profileData.photoUrl || "https://via.placeholder.com/120"}
                alt={`${profileData.firstName} ${profileData.lastName}`}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
              {isEditing && (
                <div className="avatar-edit-overlay">
                  <Camera size={20} />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleInputChange}
                placeholder="Photo URL"
                className="form-input"
              />
            ) : null}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-name-section">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="form-input"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="form-input"
                />
              </div>
            ) : (
              <h1 className="profile-name">
                {profileData.firstName} {profileData.lastName}
              </h1>
            )}

            <div className="profile-actions">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <Mail size={18} />
                <div className="detail-content">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span>{profileData.emailId}</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={18} />
                <div className="detail-content">
                  <label>Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      max="100"
                      className="form-input"
                    />
                  ) : (
                    <span>{profileData.age || "Not specified"}</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <Users size={18} />
                <div className="detail-content">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <span>{profileData.gender || "Not specified"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>About</h3>
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="form-textarea"
                rows="4"
              />
            ) : (
              <p className="about-text">
                {profileData.about || "No bio added yet. Click edit to add your bio."}
              </p>
            )}
          </div>

          <div className="detail-section">
            <h3>Skills</h3>
            {isEditing ? (
              <div className="skills-edit">
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                  className="form-input"
                />
                <small className="help-text">Separate skills with commas</small>
              </div>
            ) : (
              <div className="skills-display">
                {profileData.skills && profileData.skills.length > 0 ? (
                  <div className="skills-tags">
                    {(Array.isArray(profileData.skills) ? profileData.skills : [profileData.skills]).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        <Briefcase size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="no-skills">No skills added yet. Click edit to add your skills.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
