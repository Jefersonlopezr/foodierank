const Utils = {
  // Formatea fecha a string legible
  formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('es-ES', options);
  },

  // Formatea tiempo relativo (ej: "hace 2 días")
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

  // Formatea precio con moneda
  formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  // Formatea rating con decimal
  formatRating(rating) {
    if (rating === null || rating === undefined) return '0.0';
    return rating.toFixed(1);
  },

  // Trunca texto a longitud especificada
  truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Función debounce para limitar tasa de ejecución
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

  // Valida formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Valida formato de URL
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Genera HTML de estrellas de rating
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

  // Sanitiza HTML para prevenir XSS
  sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Muestra notificación toast
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

  // Muestra spinner de carga
  showLoader(container) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';

    if (container) {
      container.appendChild(loader);
    }

    return loader;
  },

  // Remueve spinner de carga
  hideLoader(loader) {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  },

  // Obtiene parámetros de query de URL
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    return params;
  },

  // Actualiza URL con parámetros de query sin recargar
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

  // Obtiene URL de imagen placeholder
  getPlaceholderImage(type = 'restaurant') {
    const placeholders = {
      restaurant: 'https://via.placeholder.com/400x300/2a2a2a/ffffff?text=Restaurant',
      dish: 'https://via.placeholder.com/300x200/2a2a2a/ffffff?text=Dish',
      user: 'https://via.placeholder.com/100x100/2a2a2a/ffffff?text=User'
    };

    return placeholders[type] || placeholders.restaurant;
  },

  // Maneja error de carga de imagen con placeholder
  handleImageError(img, type = 'restaurant') {
    img.src = this.getPlaceholderImage(type);
    img.classList.add('placeholder-image');
  },

  // Scroll al inicio de la página suavemente
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  // Verifica si el usuario está en dispositivo móvil
  isMobile() {
    return window.innerWidth <= 768;
  },

  // Copia texto al portapapeles
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
