const AuthService = {
  /**
   * Get stored authentication token
   * @returns {string|null} JWT token
   */
  getToken() {
    return localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
  },

  /**
   * Get stored user data
   * @returns {Object|null} User object
   */
  getUser() {
    const userData = localStorage.getItem(CONFIG.AUTH.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check token expiry
    const expiry = localStorage.getItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY);
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * Check if user is admin
   * @returns {boolean} True if user is admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  /**
   * Store authentication data
   * @param {string} token - JWT token
   * @param {Object} user - User object
   */
  storeAuth(token, user) {
    localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(user));

    // Store expiry time (24 hours from now)
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response with token and user
   */
  async register(userData) {
    try {
      const response = await API.auth.register(userData);

      if (response.success && response.data.token) {
        this.storeAuth(response.data.token, response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email/username and password)
   * @returns {Promise<Object>} Response with token and user
   */
  async login(credentials) {
    try {
      const response = await API.auth.login(credentials);

      if (response.success && response.data.token) {
        this.storeAuth(response.data.token, response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    localStorage.removeItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY);

    // Redirect to login page
    window.location.href = '/pages/login.html';
  },

  /**
   * Get user profile from API
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await API.auth.getProfile();

      if (response.success && response.data.user) {
        // Update stored user data
        localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(data) {
    try {
      const response = await API.auth.updateProfile(data);

      if (response.success && response.data.user) {
        // Update stored user data
        localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Require authentication - redirect to login if not authenticated
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  /**
   * Require admin role - redirect if not admin
   */
  requireAdmin() {
    if (!this.requireAuth()) return false;

    if (!this.isAdmin()) {
      Utils.showToast('No tienes permisos de administrador', 'error');
      window.location.href = '/index.html';
      return false;
    }

    return true;
  },

  /**
   * Initialize auth state on page load
   */
  init() {
    // Check if token is expired
    if (this.getToken() && !this.isAuthenticated()) {
      Utils.showToast('Tu sesión ha expirado', 'warning');
    }
  }
};

// Initialize auth service on page load
document.addEventListener('DOMContentLoaded', () => {
  AuthService.init();
});
