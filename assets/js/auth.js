const AuthService = {
  // Obtiene token de autenticación almacenado
  getToken() {
    return localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
  },

  // Obtiene datos de usuario almacenados
  getUser() {
    const userData = localStorage.getItem(CONFIG.AUTH.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Verifica si el usuario está autenticado
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

  // Verifica si el usuario es administrador
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // Almacena datos de autenticación
  storeAuth(token, user) {
    localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(user));

    // Store expiry time (24 hours from now)
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  // Registra nuevo usuario
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

  // Inicia sesión de usuario
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

  // Cierra sesión de usuario
  logout() {
    localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    localStorage.removeItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY);

    // Redirect to login page
    window.location.href = '/pages/login.html';
  },

  // Obtiene perfil de usuario desde API
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

  // Actualiza perfil de usuario
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

  // Requiere autenticación - redirige a login si no está autenticado
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  // Requiere rol de administrador - redirige si no es admin
  requireAdmin() {
    if (!this.requireAuth()) return false;

    if (!this.isAdmin()) {
      Utils.showToast('No tienes permisos de administrador', 'error');
      window.location.href = '/index.html';
      return false;
    }

    return true;
  },

  // Inicializa estado de autenticación al cargar página
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
