let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    search: '',
    category: '',
    city: '',
    sort: 'rating'
};

document.addEventListener('DOMContentLoaded', async () => {
    initAuth();
    initMobileMenu();
    await loadCategories();
    await loadCities();
    await loadRestaurants();
    initFilters();
    initPagination();
    initModal();
});

function initAuth() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const myRestaurantsLink = document.getElementById('myRestaurantsLink');
    const adminLink = document.getElementById('adminLink');
    const profileLink = document.getElementById('profileLink');
    const addRestaurantBtn = document.getElementById('addRestaurantBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (AuthService.isAuthenticated()) {
        const user = AuthService.getUser();

        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = user.username;
        if (myRestaurantsLink) myRestaurantsLink.style.display = 'block';
        if (addRestaurantBtn) addRestaurantBtn.style.display = 'block';

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
                window.location.href = 'profile.html';
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

async function loadCategories() {
    try {
        const response = await API.categories.getAll({ simple: true });

        if (response.success && response.data.categories) {
            const categoryFilter = document.getElementById('categoryFilter');
            const restaurantCategory = document.getElementById('restaurantCategory');

            response.data.categories.forEach(category => {
                if (categoryFilter) {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    categoryFilter.appendChild(option);
                }

                if (restaurantCategory) {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    restaurantCategory.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadCities() {
    try {
        const response = await API.restaurants.getCities();

        if (response.success && response.data.cities) {
            const cityFilter = document.getElementById('cityFilter');

            response.data.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

async function loadRestaurants() {
    const restaurantsGrid = document.getElementById('restaurantsGrid');
    const restaurantsLoader = document.getElementById('restaurantsLoader');
    const restaurantsError = document.getElementById('restaurantsError');
    const resultsCount = document.getElementById('resultsCount');
    const paginationContainer = document.getElementById('paginationContainer');

    try {
        restaurantsLoader.style.display = 'flex';
        restaurantsError.style.display = 'none';
        restaurantsGrid.innerHTML = '';

        const params = {
            page: currentPage,
            limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
            ...currentFilters
        };

        const response = await API.restaurants.getAll(params);

        if (response.success && response.data.restaurants) {
            const { restaurants, pagination } = response.data;

            totalPages = pagination.totalPages;
            document.getElementById('currentPage').textContent = pagination.page;
            document.getElementById('totalPages').textContent = pagination.totalPages;

            if (restaurants.length === 0) {
                restaurantsGrid.innerHTML = '<p class="error-message">No se encontraron restaurantes</p>';
                paginationContainer.style.display = 'none';
            } else {
                restaurantsGrid.innerHTML = restaurants.map(restaurant =>
                    createRestaurantCard(restaurant)
                ).join('');

                paginationContainer.style.display = 'flex';
            }

            resultsCount.textContent = `Mostrando ${restaurants.length} de ${pagination.total} restaurantes`;

            updatePaginationButtons();
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        restaurantsError.style.display = 'block';
    } finally {
        restaurantsLoader.style.display = 'none';
    }
}

function createRestaurantCard(restaurant) {
    const imageUrl = restaurant.imageUrl || Utils.getPlaceholderImage('restaurant');
    const isApproved = restaurant.isApproved;
    const statusClass = isApproved ? 'status-approved' : 'status-pending';
    const statusText = isApproved ? 'Aprobado' : 'Pendiente';

    return `
    <a href="restaurant-detail.html?id=${restaurant._id}" class="restaurant-card">
      <div style="position: relative;">
        <img
          src="${imageUrl}"
          alt="${Utils.sanitizeHTML(restaurant.name)}"
          class="restaurant-image"
          onerror="Utils.handleImageError(this, 'restaurant')"
        >
      </div>

      <div class="restaurant-content">
        <div class="restaurant-header">
          <h3 class="restaurant-name">${Utils.sanitizeHTML(restaurant.name)}</h3>
          <p class="restaurant-category">${Utils.sanitizeHTML(restaurant.categoryName || 'Sin categoría')}</p>
        </div>

        <div class="restaurant-rating">
          ${Utils.generateStars(restaurant.averageRating || 0)}
          <span class="rating-value">${Utils.formatRating(restaurant.averageRating || 0)}</span>
          <span class="rating-count">(${restaurant.totalReviews || 0})</span>
        </div>

        <p class="restaurant-description">
          ${Utils.truncateText(Utils.sanitizeHTML(restaurant.description), 120)}
        </p>

        <div class="restaurant-footer">
          <span class="restaurant-location">${Utils.sanitizeHTML(restaurant.location?.city || 'N/A')}</span>
          <span class="restaurant-status ${statusClass}">${statusText}</span>
        </div>
      </div>
    </a>
  `;
}

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const cityFilter = document.getElementById('cityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    const debouncedSearch = Utils.debounce(() => {
        currentFilters.search = searchInput.value.trim();
        currentPage = 1;
        loadRestaurants();
    }, 500);

    searchInput.addEventListener('input', debouncedSearch);

    categoryFilter.addEventListener('change', () => {
        currentFilters.category = categoryFilter.value;
        currentPage = 1;
        loadRestaurants();
    });

    cityFilter.addEventListener('change', () => {
        currentFilters.city = cityFilter.value;
        currentPage = 1;
        loadRestaurants();
    });

    sortFilter.addEventListener('change', () => {
        currentFilters.sort = sortFilter.value;
        currentPage = 1;
        loadRestaurants();
    });

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = '';
        cityFilter.value = '';
        sortFilter.value = 'rating';

        currentFilters = {
            search: '',
            category: '',
            city: '',
            sort: 'rating'
        };

        currentPage = 1;
        loadRestaurants();
    });
}

function initPagination() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadRestaurants();
            Utils.scrollToTop();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadRestaurants();
            Utils.scrollToTop();
        }
    });
}

function updatePaginationButtons() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function initModal() {
    const addRestaurantBtn = document.getElementById('addRestaurantBtn');
    const modal = document.getElementById('addRestaurantModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addRestaurantForm = document.getElementById('addRestaurantForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (addRestaurantBtn) {
        addRestaurantBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                addRestaurantForm?.reset();
                document.getElementById('modalError').style.display = 'none';
            }, 300);
        }
    }

    closeModalBtn?.addEventListener('click', closeModal);
    cancelModalBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    addRestaurantForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateRestaurant();
    });
}

async function handleCreateRestaurant() {
    const submitBtn = document.getElementById('submitRestaurantBtn');
    const modalError = document.getElementById('modalError');

    const data = {
        name: document.getElementById('restaurantName').value.trim(),
        description: document.getElementById('restaurantDescription').value.trim(),
        categoryId: document.getElementById('restaurantCategory').value,
        location: {
            address: document.getElementById('restaurantAddress').value.trim(),
            city: document.getElementById('restaurantCity').value.trim()
        },
        imageUrl: document.getElementById('restaurantImage').value.trim() || undefined
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando...';
    modalError.style.display = 'none';

    try {
        const response = await API.restaurants.create(data);

        if (response.success) {
            Utils.showToast('Restaurante creado correctamente. Pendiente de aprobación.', 'success');
            const modal = document.getElementById('addRestaurantModal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('addRestaurantForm').reset();
            }, 300);
            await loadRestaurants();
        }
    } catch (error) {
        console.error('Error creating restaurant:', error);
        modalError.textContent = error.message || 'Error al crear el restaurante';
        modalError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear Restaurante';
    }
}
