const Utils = {
  /**
   * Format date to readable string
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('es-ES', options);
  },

  /**
   * Format relative time (e.g., "hace 2 días")
   * @param {string|Date} date - Date to format
   * @returns {string} Relative time string
   */
  formatRelativeTime(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  },

  /**
   * Format price with currency
   * @param {number} price - Price to format
   * @returns {string} Formatted price string
   */
  formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  /**
   * Format rating with decimal
   * @param {number} rating - Rating to format
   * @returns {string} Formatted rating string
   */
  formatRating(rating) {
    if (rating === null || rating === undefined) return '0.0';
    return rating.toFixed(1);
  },

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Debounce function to limit execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait = CONFIG.UI.DEBOUNCE_DELAY) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Generate star rating HTML
   * @param {number} rating - Rating value (0-5)
   * @param {boolean} interactive - Whether stars are clickable
   * @returns {string} HTML string for stars
   */
  generateStars(rating, interactive = false) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '<div class="stars' + (interactive ? ' interactive' : '') + '">';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      html += `<span class="star filled" data-rating="${i + 1}">★</span>`;
    }

    // Half star
    if (hasHalfStar) {
      html += `<span class="star half" data-rating="${fullStars + 1}">★</span>`;
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      html += `<span class="star empty" data-rating="${fullStars + (hasHalfStar ? 1 : 0) + i + 1}">★</span>`;
    }

    html += '</div>';
    return html;
  },

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Show notification toast
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, info, warning)
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, CONFIG.UI.TOAST_DURATION);
  },

  /**
   * Show loading spinner
   * @param {HTMLElement} container - Container element
   * @returns {HTMLElement} Loader element
   */
  showLoader(container) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';

    if (container) {
      container.appendChild(loader);
    }

    return loader;
  },

  /**
   * Remove loading spinner
   * @param {HTMLElement} loader - Loader element to remove
   */
  hideLoader(loader) {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  },

  /**
   * Parse query parameters from URL
   * @returns {Object} Object with query parameters
   */
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    return params;
  },

  /**
   * Update URL with query parameters without reload
   * @param {Object} params - Parameters to add to URL
   */
  updateQueryParams(params) {
    const url = new URL(window.location.href);

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState({}, '', url);
  },

  /**
   * Get placeholder image URL
   * @param {string} type - Type of placeholder (restaurant, dish, user)
   * @returns {string} Placeholder image URL
   */
  getPlaceholderImage(type = 'restaurant') {
    const placeholders = {
      restaurant: 'https://via.placeholder.com/400x300/2a2a2a/ffffff?text=Restaurant',
      dish: 'https://via.placeholder.com/300x200/2a2a2a/ffffff?text=Dish',
      user: 'https://via.placeholder.com/100x100/2a2a2a/ffffff?text=User'
    };

    return placeholders[type] || placeholders.restaurant;
  },

  /**
   * Handle image load error with placeholder
   * @param {HTMLImageElement} img - Image element
   * @param {string} type - Type of placeholder
   */
  handleImageError(img, type = 'restaurant') {
    img.src = this.getPlaceholderImage(type);
    img.classList.add('placeholder-image');
  },

  /**
   * Scroll to top of page smoothly
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  /**
   * Check if user is on mobile device
   * @returns {boolean} True if mobile
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise} Promise that resolves when copied
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copiado al portapapeles', 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      this.showToast('Error al copiar', 'error');
    }
  }
};
