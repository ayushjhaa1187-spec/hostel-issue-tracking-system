// Input Validators - Phase 2.3 Security
// Validates and sanitizes user input to prevent injection attacks

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate password strength
const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  return hasUpperCase && hasLowerCase && hasNumbers;
};

// Validate issue title
const validateTitle = (title) => {
  return title && title.trim().length >= 3 && title.length <= 200;
};

// Validate issue description
const validateDescription = (description) => {
  return !description || (description.length <= 2000);
};

// Validate category
const validateCategory = (category) => {
  const validCategories = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Maintenance', 'Other'];
  return validCategories.includes(category);
};

// Validate priority
const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
};

// Validate status
const validateStatus = (status) => {
  const validStatuses = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  return validStatuses.includes(status);
};

// Validate hostel/block name
const validateHostelBlock = (name) => {
  return name && /^[A-Z0-9]{1,10}$/.test(name);
};

// Sanitize string input (remove HTML, trim whitespace)
const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/<[^>]*>/g, '');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateTitle,
  validateDescription,
  validateCategory,
  validatePriority,
  validateStatus,
  validateHostelBlock,
  sanitizeString
};
