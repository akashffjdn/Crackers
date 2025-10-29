// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic Indian phone number regex (adjust as needed)
  const phoneRegex = /^[6-9]\d{9}$/;
  // More permissive regex: /^[+]?[1-9][\d\s\-\(\)]{8,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, '')); // Remove spaces before testing
};

// Updated Password Validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const minLength = 8; // Increased minimum length

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Include at least one uppercase letter (A-Z)');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Include at least one lowercase letter (a-z)');
  }

  if (!/\d/.test(password)) {
    errors.push('Include at least one number (0-9)');
  }

   // Optional: Add special character requirement
   // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
   //   errors.push('Include at least one special character');
   // }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};