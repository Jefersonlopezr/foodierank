const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api/v1'
      : 'https://backend-foodierank.onrender.com/api/v1',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
  },

  // Authentication
  AUTH: {
    TOKEN_KEY: 'foodierank_token',
    USER_KEY: 'foodierank_user',
    TOKEN_EXPIRY_KEY: 'foodierank_token_expiry'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
  },

  // Rating
  RATING: {
    MIN: 1,
    MAX: 5
  },

  // Validation
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_]+$/
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    },
    COMMENT: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500
    },
    RESTAURANT_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500
    }
  },

  // UI Settings
  UI: {
    TOAST_DURATION: 3000, // 3 seconds
    LOADER_DELAY: 200, // Show loader after 200ms
    DEBOUNCE_DELAY: 300 // For search inputs
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
