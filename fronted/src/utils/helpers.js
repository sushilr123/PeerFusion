// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateAge = (age) => {
  return age >= 18 && age <= 100;
};

// Format utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(dateString);
};

// File utilities
export const getFilePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please select a valid image file (JPEG, PNG, or GIF)");
  }

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
};

// Local storage utilities
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Array utilities
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Debounce utility
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Skills data
export const POPULAR_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "Vue.js",
  "Angular",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Docker",
  "AWS",
  "Git",
  "HTML",
  "CSS",
  "SASS",
  "Redux",
  "GraphQL",
  "REST API",
  "Firebase",
  "Next.js",
  "Laravel",
  "PHP",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "DevOps",
  "Kubernetes",
  "Jenkins",
  "Machine Learning",
  "Data Science",
  "AI",
  "Blockchain",
];

// Error handling
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data) {
    return error.response.data;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
