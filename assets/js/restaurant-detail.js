let restaurantId = null;
let restaurantData = null;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', async () => {
    initAuth();
    initMobileMenu();

    const params = Utils.getQueryParams();
    restaurantId = params.id;

    if (!restaurantId) {
        showError();
        return;
    }

    await loadRestaurant();
    await loadDishes();
    await loadReviews();

    initReviewModal();
    initDishModal();
});

function initAuth() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const myRestaurantsLink = document.getElementById('myRestaurantsLink');
    const adminLink = document.getElementById('adminLink');
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

async function loadRestaurant() {
    const loader = document.getElementById('restaurantLoader');
    const error = document.getElementById('restaurantError');
    const content = document.getElementById('restaurantContent');

    try {
        loader.style.display = 'flex';
        error.style.display = 'none';

        const response = await API.restaurants.getById(restaurantId);

        if (response.success && response.data.restaurant) {
            restaurantData = response.data.restaurant;
            displayRestaurant(restaurantData);

            content.style.display = 'block';

            if (AuthService.isAuthenticated()) {
                checkUserPermissions(restaurantData);
            }
        }
    } catch (err) {
        console.error('Error loading restaurant:', err);
        showError();
    } finally {
        loader.style.display = 'none';
    }
}

function displayRestaurant(restaurant) {
    const imageUrl = restaurant.imageUrl || Utils.getPlaceholderImage('restaurant');

    document.getElementById('heroImage').src = imageUrl;
    document.getElementById('heroImage').alt = restaurant.name;
    document.getElementById('restaurantName').textContent = restaurant.name;
    document.getElementById('restaurantCategory').textContent = restaurant.categoryName || 'Sin categoría';
    document.getElementById('restaurantRating').textContent = Utils.formatRating(restaurant.averageRating || 0);
    document.getElementById('restaurantReviewsCount').textContent = `(${restaurant.totalReviews || 0} reseñas)`;
    document.getElementById('restaurantAddress').textContent = restaurant.location?.address || 'N/A';
    document.getElementById('restaurantCity').textContent = restaurant.location?.city || 'N/A';
    document.getElementById('restaurantDescription').textContent = restaurant.description;

    document.getElementById('restaurantStars').innerHTML = Utils.generateStars(restaurant.averageRating || 0);

    document.title = `${restaurant.name} - FoodieRank`;
}

function checkUserPermissions(restaurant) {
    const user = AuthService.getUser();
    const addReviewBtn = document.getElementById('addReviewBtn');
    const addDishBtn = document.getElementById('addDishBtn');

    if (addReviewBtn && restaurant.isApproved) {
        addReviewBtn.style.display = 'block';
    }

    if (addDishBtn && (user.role === 'admin' || restaurant.createdBy === user.id)) {
        addDishBtn.style.display = 'block';
    }
}

async function loadDishes() {
    const dishesLoader = document.getElementById('dishesLoader');
    const dishesGrid = document.getElementById('dishesGrid');
    const dishesEmpty = document.getElementById('dishesEmpty');

    try {
        dishesLoader.style.display = 'flex';
        dishesEmpty.style.display = 'none';

        const response = await API.dishes.getByRestaurant(restaurantId);

        if (response.success && response.data.dishes) {
            const dishes = response.data.dishes;

            if (dishes.length === 0) {
                dishesEmpty.style.display = 'block';
            } else {
                dishesGrid.innerHTML = dishes.map(dish => createDishCard(dish)).join('');
            }
        }
    } catch (error) {
        console.error('Error loading dishes:', error);
    } finally {
        dishesLoader.style.display = 'none';
    }
}

function createDishCard(dish) {
    const imageUrl = dish.imageUrl || Utils.getPlaceholderImage('dish');

    return `
    <div class="dish-card">
      <img
        src="${imageUrl}"
        alt="${Utils.sanitizeHTML(dish.name)}"
        class="dish-image"
        onerror="Utils.handleImageError(this, 'dish')"
      >
      <div class="dish-content">
        <div class="dish-header">
          <h3 class="dish-name">${Utils.sanitizeHTML(dish.name)}</h3>
          <span class="dish-price">${Utils.formatPrice(dish.price)}</span>
        </div>
        ${dish.description ? `
          <p class="dish-description">${Utils.sanitizeHTML(dish.description)}</p>
        ` : ''}
      </div>
    </div>
  `;
}

async function loadReviews() {
    const reviewsLoader = document.getElementById('reviewsLoader');
    const reviewsList = document.getElementById('reviewsList');
    const reviewsEmpty = document.getElementById('reviewsEmpty');

    try {
        reviewsLoader.style.display = 'flex';
        reviewsEmpty.style.display = 'none';

        const response = await API.reviews.getByRestaurant(restaurantId);

        if (response.success && response.data.reviews) {
            const reviews = response.data.reviews;

            if (reviews.length === 0) {
                reviewsEmpty.style.display = 'block';
            } else {
                reviewsList.innerHTML = reviews.map(review => createReviewCard(review)).join('');
                attachReviewListeners();
            }
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    } finally {
        reviewsLoader.style.display = 'none';
    }
}

function createReviewCard(review) {
    const user = AuthService.getUser();
    const hasLiked = user && review.likes?.includes(user.id);
    const hasDisliked = user && review.dislikes?.includes(user.id);

    return `
    <div class="review-card" data-review-id="${review._id}">
      <div class="review-header">
        <div class="review-user-info">
          <span class="review-username">${Utils.sanitizeHTML(review.username || 'Usuario')}</span>
          <span class="review-date">${Utils.formatRelativeTime(review.createdAt)}</span>
        </div>
        <div class="review-rating">
          ${Utils.generateStars(review.rating)}
        </div>
      </div>

      <p class="review-comment">${Utils.sanitizeHTML(review.comment)}</p>

      <div class="review-actions">
        <button class="review-action-btn ${hasLiked ? 'active' : ''}" data-action="like" data-review-id="${review._id}">
          👍 <span>${review.likesCount || 0}</span>
        </button>
        <button class="review-action-btn ${hasDisliked ? 'active' : ''}" data-action="dislike" data-review-id="${review._id}">
          👎 <span>${review.dislikesCount || 0}</span>
        </button>
      </div>
    </div>
  `;
}

function attachReviewListeners() {
    document.querySelectorAll('.review-action-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!AuthService.isAuthenticated()) {
                Utils.showToast('Debes iniciar sesión', 'warning');
                return;
            }

            const action = btn.dataset.action;
            const reviewId = btn.dataset.reviewId;

            await handleReviewAction(action, reviewId);
        });
    });
}

async function handleReviewAction(action, reviewId) {
    try {
        if (action === 'like') {
            await API.reviews.toggleLike(reviewId);
        } else if (action === 'dislike') {
            await API.reviews.toggleDislike(reviewId);
        }

        await loadReviews();
    } catch (error) {
        console.error('Error handling review action:', error);
        Utils.showToast('Error al procesar la acción', 'error');
    }
}

function initReviewModal() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const modal = document.getElementById('addReviewModal');
    const closeBtn = document.getElementById('closeReviewModalBtn');
    const cancelBtn = document.getElementById('cancelReviewBtn');
    const form = document.getElementById('addReviewForm');
    const overlay = modal?.querySelector('.modal-overlay');
    const ratingInput = document.getElementById('ratingInput');

    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            if (!AuthService.isAuthenticated()) {
                Utils.showToast('Debes iniciar sesión', 'warning');
                window.location.href = 'login.html';
                return;
            }
            modal.style.display = 'flex';
            selectedRating = 0;
            updateRatingStars();
        });
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            form?.reset();
            selectedRating = 0;
            updateRatingStars();
            document.getElementById('reviewModalError').style.display = 'none';
        }
    }

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    if (ratingInput) {
        ratingInput.querySelectorAll('.star-input').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                document.getElementById('reviewRating').value = selectedRating;
                updateRatingStars();
            });
        });
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateReview();
    });
}

function updateRatingStars() {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach(star => {
        const rating = parseInt(star.dataset.rating);
        if (rating <= selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

async function handleCreateReview() {
    const submitBtn = document.getElementById('submitReviewBtn');
    const modalError = document.getElementById('reviewModalError');

    const data = {
        rating: selectedRating,
        comment: document.getElementById('reviewComment').value.trim()
    };

    if (!data.rating) {
        modalError.textContent = 'Debes seleccionar una calificación';
        modalError.style.display = 'block';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Publicando...';
    modalError.style.display = 'none';

    try {
        const response = await API.reviews.create(restaurantId, data);

        if (response.success) {
            Utils.showToast('Reseña publicada correctamente', 'success');
            document.getElementById('addReviewModal').style.display = 'none';
            document.getElementById('addReviewForm').reset();
            selectedRating = 0;
            await loadRestaurant();
            await loadReviews();
        }
    } catch (error) {
        console.error('Error creating review:', error);
        modalError.textContent = error.message || 'Error al publicar la reseña';
        modalError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publicar Reseña';
    }
}

function initDishModal() {
    const addDishBtn = document.getElementById('addDishBtn');
    const modal = document.getElementById('addDishModal');
    const closeBtn = document.getElementById('closeDishModalBtn');
    const cancelBtn = document.getElementById('cancelDishBtn');
    const form = document.getElementById('addDishForm');
    const overlay = modal?.querySelector('.modal-overlay');

    if (addDishBtn) {
        addDishBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            form?.reset();
            document.getElementById('dishModalError').style.display = 'none';
        }
    }

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateDish();
    });
}

async function handleCreateDish() {
    const submitBtn = document.getElementById('submitDishBtn');
    const modalError = document.getElementById('dishModalError');

    const data = {
        name: document.getElementById('dishName').value.trim(),
        description: document.getElementById('dishDescription').value.trim() || undefined,
        price: parseFloat(document.getElementById('dishPrice').value),
        imageUrl: document.getElementById('dishImage').value.trim() || undefined
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Agregando...';
    modalError.style.display = 'none';

    try {
        const response = await API.dishes.create(restaurantId, data);

        if (response.success) {
            Utils.showToast('Plato agregado correctamente', 'success');
            document.getElementById('addDishModal').style.display = 'none';
            document.getElementById('addDishForm').reset();
            await loadDishes();
        }
    } catch (error) {
        console.error('Error creating dish:', error);
        modalError.textContent = error.message || 'Error al agregar el plato';
        modalError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agregar Plato';
    }
}

function showError() {
    document.getElementById('restaurantLoader').style.display = 'none';
    document.getElementById('restaurantError').style.display = 'block';
}