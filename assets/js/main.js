document.addEventListener('DOMContentLoaded', async () => {
    initAuth();
    initMobileMenu();
    await loadStats();
    await loadTopRanking();
});

function initAuth() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const myRestaurantsLink = document.getElementById('myRestaurantsLink');
    const adminLink = document.getElementById('adminLink');
    const profileLink = document.getElementById('profileLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (AuthService.isAuthenticated()) {
        const user = AuthService.getUser();

        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = user.username;
        if (myRestaurantsLink) myRestaurantsLink.style.display = 'block';

        if (user.role === 'admin' && adminLink) {
            adminLink.style.display = 'block';
        }

        if (userMenuToggle && userMenuDropdown) {
            userMenuToggle.addEventListener('click', () => {
                userMenuDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    userMenuDropdown.classList.remove('show');
                }
            });
        }

        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'pages/profile.html';
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                AuthService.logout();
            });
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

async function loadStats() {
    try {
        const stats = await API.restaurants.getStats();

        if (stats.success && stats.data) {
            const { totalRestaurants, totalReviews, totalCategories, totalCities } = stats.data;

            document.getElementById('totalRestaurants').textContent = totalRestaurants || 0;
            document.getElementById('totalReviews').textContent = totalReviews || 0;
            document.getElementById('totalCategories').textContent = totalCategories || 0;
            document.getElementById('totalCities').textContent = totalCities || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadTopRanking() {
    const rankingList = document.getElementById('rankingList');
    const rankingLoader = document.getElementById('rankingLoader');
    const rankingError = document.getElementById('rankingError');

    try {
        rankingLoader.style.display = 'flex';
        rankingError.style.display = 'none';

        const response = await API.restaurants.getRanking({ limit: 10 });

        if (response.success && response.data.restaurants) {
            const restaurants = response.data.restaurants;

            if (restaurants.length === 0) {
                rankingList.innerHTML = '<p class="error-message">No hay restaurantes disponibles</p>';
            } else {
                rankingList.innerHTML = restaurants.map((restaurant, index) =>
                    createRankingCard(restaurant, index + 1)
                ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading ranking:', error);
        rankingError.style.display = 'block';
    } finally {
        rankingLoader.style.display = 'none';
    }
}

function createRankingCard(restaurant, position) {
    const isTop3 = position <= 3;
    const imageUrl = restaurant.imageUrl || Utils.getPlaceholderImage('restaurant');
    const score = restaurant.score || restaurant.averageRating || 0;

    return `
    <a href="pages/restaurant-detail.html?id=${restaurant._id}" class="ranking-card">
      <div class="ranking-position ${isTop3 ? 'top-3' : ''}">${position}</div>

      <img
        src="${imageUrl}"
        alt="${Utils.sanitizeHTML(restaurant.name)}"
        class="ranking-image"
        onerror="Utils.handleImageError(this, 'restaurant')"
      >

      <div class="ranking-content">
        <div class="ranking-header">
          <h3 class="ranking-name">${Utils.sanitizeHTML(restaurant.name)}</h3>
          <div class="ranking-score">
            <div class="score-value">${Utils.formatRating(score)}</div>
            <div class="score-label">Puntuación</div>
          </div>
        </div>

        <div class="ranking-meta">
          <div class="meta-item">
            ${Utils.generateStars(restaurant.averageRating || 0)}
          </div>
          <div class="meta-item">
            ${restaurant.totalReviews || 0} reseñas
          </div>
          <div class="meta-item">
            ${Utils.sanitizeHTML(restaurant.location?.city || 'N/A')}
          </div>
        </div>

        ${restaurant.description ? `
          <p class="ranking-description">
            ${Utils.truncateText(Utils.sanitizeHTML(restaurant.description), 150)}
          </p>
        ` : ''}
      </div>
    </a>
  `;
}
