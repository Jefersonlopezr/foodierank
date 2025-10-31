const API = {
  // Realiza petición HTTP a la API
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API.BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    // Add authorization token if available
    const token = AuthService.getToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.error?.code === 'TOKEN_EXPIRED') {
        AuthService.logout();
        window.location.href = '/pages/login.html';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      // Handle errors
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Petición GET
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  // Petición POST
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Petición PUT
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Petición PATCH
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Petición DELETE
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Auth endpoints
  auth: {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getProfile: () => API.get('/auth/profile'),
    updateProfile: (data) => API.put('/auth/profile', data),
    logout: () => API.post('/auth/logout')
  },

  // Categories endpoints
  categories: {
    getAll: (params) => API.get('/categories', params),
    create: (data) => API.post('/categories', data)
  },

  // Restaurants endpoints
  restaurants: {
    getAll: (params) => API.get('/restaurants', params),
    getById: (id) => API.get(`/restaurants/${id}`),
    getRanking: (params) => API.get('/restaurants/ranking', params),
    getStats: () => API.get('/restaurants/stats'),
    getCities: () => API.get('/restaurants/cities'),
    getMyRestaurants: () => API.get('/restaurants/my-restaurants'),
    create: (data) => API.post('/restaurants', data),
    update: (id, data) => API.put(`/restaurants/${id}`, data),
    approve: (id) => API.patch(`/restaurants/${id}/approve`),
    delete: (id) => API.delete(`/restaurants/${id}`)
  },

  // Dishes endpoints
  dishes: {
    getByRestaurant: (restaurantId) => API.get(`/restaurants/${restaurantId}/dishes`),
    create: (restaurantId, data) => API.post(`/restaurants/${restaurantId}/dishes`, data),
    update: (restaurantId, dishId, data) => API.put(`/restaurants/${restaurantId}/dishes/${dishId}`, data),
    delete: (restaurantId, dishId) => API.delete(`/restaurants/${restaurantId}/dishes/${dishId}`)
  },

  // Reviews endpoints
  reviews: {
    getByRestaurant: (restaurantId, params) => API.get(`/restaurants/${restaurantId}/reviews`, params),
    getById: (id) => API.get(`/reviews/${id}`),
    create: (restaurantId, data) => API.post(`/restaurants/${restaurantId}/reviews`, data),
    update: (id, data) => API.put(`/reviews/${id}`, data),
    delete: (id) => API.delete(`/reviews/${id}`),
    toggleLike: (id) => API.post(`/reviews/${id}/like`),
    toggleDislike: (id) => API.post(`/reviews/${id}/dislike`)
  },

  // Users endpoints
  users: {
    getAll: (params) => API.get('/users', params),
    getById: (id) => API.get(`/users/${id}`),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`)
  }
};
