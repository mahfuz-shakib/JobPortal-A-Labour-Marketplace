// Form validation utilities
export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateBudget = (budget) => {
  const num = Number(budget);
  return !isNaN(num) && num > 0;
};

export const validateWorkersNeeded = (workers) => {
  const num = Number(workers);
  return !isNaN(num) && num > 0 && num <= 100;
};

export const validateDate = (date) => {
  if (!date) return true; // Optional field
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateFutureDate = (date) => {
  if (!date) return true; // Optional field
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj instanceof Date && !isNaN(dateObj) && dateObj > now;
};

// Form validation schemas
export const loginValidation = {
  phone: (value) => {
    if (!validateRequired(value)) return 'Phone is required';
    if (!validatePhone(value)) return 'Please enter a valid Bangladeshi phone number';
    return null;
  },
  password: (value) => {
    if (!validateRequired(value)) return 'Password is required';
    if (!validatePassword(value)) return 'Password must be at least 6 characters';
    return null;
  }
};

export const registerValidation = {
  name: (value) => {
    if (!validateRequired(value)) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return null;
  },
  phone: (value) => {
    if (!validateRequired(value)) return 'Phone is required';
    if (!validatePhone(value)) return 'Please enter a valid Bangladeshi phone number';
    return null;
  },
  password: (value) => {
    if (!validateRequired(value)) return 'Password is required';
    if (!validatePassword(value)) return 'Password must be at least 6 characters';
    return null;
  },
  role: (value) => {
    if (!validateRequired(value)) return 'Please select a role';
    if (!['client', 'worker'].includes(value)) return 'Invalid role selected';
    return null;
  }
};

export const jobValidation = {
  title: (value) => {
    if (!validateRequired(value)) return 'Job title is required';
    if (value.length < 5) return 'Title must be at least 5 characters';
    return null;
  },
  description: (value) => {
    if (!validateRequired(value)) return 'Job description is required';
    if (value.length < 10) return 'Description must be at least 10 characters';
    return null;
  },
  location: (value) => {
    if (!validateRequired(value)) return 'Location is required';
    return null;
  },
  budget: (value) => {
    if (!validateRequired(value)) return 'Budget is required';
    if (!validateBudget(value)) return 'Please enter a valid budget amount';
    return null;
  },
  workCategory: (value) => {
    if (!validateRequired(value)) return 'Work category is required';
    return null;
  },
  workDuration: (value) => {
    if (!validateRequired(value)) return 'Work duration is required';
    return null;
  },
  workersNeeded: (value) => {
    if (!validateRequired(value)) return 'Number of workers is required';
    if (!validateWorkersNeeded(value)) return 'Please enter a valid number of workers (1-100)';
    return null;
  }
};

export const bidValidation = {
  amount: (value) => {
    if (!validateRequired(value)) return 'Bid amount is required';
    if (!validateBudget(value)) return 'Please enter a valid amount';
    return null;
  },
  message: (value) => {
    if (!validateRequired(value)) return 'Bid message is required';
    if (value.length < 10) return 'Message must be at least 10 characters';
    return null;
  },
  workDuration: (value) => {
    if (!validateRequired(value)) return 'Work duration is required';
    if (value.length < 2) return 'Work duration must be at least 2 characters';
    return null;
  }
}; 