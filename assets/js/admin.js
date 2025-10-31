document.addEventListener('DOMContentLoaded', () => {
    if (!AuthService.requireAdmin()) {
        return;
    }

    initAuth();
    initMobileMenu();
    initTabs();
    initCategoryModal();

    loadPendingRestaurants();
});

function initAuth() {
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const myRestaurantsLink = document.getElementById('myRestaurantsLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    const user = AuthService.getUser();

    if (userName) userName.textContent = user.username;
    if (myRestaurantsLink) myRestaurantsLink.style.display = 'block';

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

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');

            if (tabName === 'pending' && !document.getElementById('pendingList').children.length) {
                loadPendingRestaurants();
            } else if (tabName === 'categories' && !document.getElementById('categoriesList').children.length) {
                loadCategories();
            } else if (tabName === 'users' && !document.getElementById('usersList').children.length) {
                loadUsers();
            }
        });
    });
}

async function loadPendingRestaurants() {
    const loader = document.getElementById('pendingLoader');
    const list = document.getElementById('pendingList');
    const empty = document.getElementById('pendingEmpty');

    try {
        loader.style.display = 'flex';
        empty.style.display = 'none';

        const response = await API.restaurants.getAll({ isApproved: false });

        if (response.success && response.data.restaurants) {
            const restaurants = response.data.restaurants;

            if (restaurants.length === 0) {
                empty.style.display = 'block';
            } else {
                list.innerHTML = restaurants.map(restaurant => createPendingCard(restaurant)).join('');
                attachPendingListeners();
            }
        }
    } catch (error) {
        console.error('Error loading pending restaurants:', error);
        Utils.showToast('Error al cargar restaurantes pendientes', 'error');
    } finally {
        loader.style.display = 'none';
    }
}

function createPendingCard(restaurant) {
    return `
    <div class="admin-card" data-restaurant-id="${restaurant._id}">
      <div class="admin-card-header">
        <div class="admin-card-info">
          <h3 class="admin-card-title">${Utils.sanitizeHTML(restaurant.name)}</h3>
          <p class="admin-card-subtitle">${Utils.sanitizeHTML(restaurant.categoryName || 'Sin categoría')}</p>
        </div>
      </div>

      <div class="admin-card-meta">
        <span>Creado por: ${Utils.sanitizeHTML(restaurant.createdByUsername || 'Desconocido')}</span>
        <span>Ciudad: ${Utils.sanitizeHTML(restaurant.location?.city || 'N/A')}</span>
        <span>Fecha: ${Utils.formatDate(restaurant.createdAt)}</span>
      </div>

      <p class="admin-card-description">${Utils.sanitizeHTML(restaurant.description)}</p>

      <div class="admin-card-actions">
        <button class="btn btn-success btn-sm approve-btn" data-id="${restaurant._id}">
          Aprobar
        </button>
        <button class="btn btn-danger btn-sm reject-btn" data-id="${restaurant._id}">
          Rechazar
        </button>
        <a href="restaurant-detail.html?id=${restaurant._id}" class="btn btn-outline btn-sm">
          Ver Detalles
        </a>
      </div>
    </div>
  `;
}

function attachPendingListeners() {
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await handleApproveRestaurant(id);
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (confirm('¿Estás seguro de rechazar este restaurante? Esta acción lo eliminará.')) {
                await handleRejectRestaurant(id);
            }
        });
    });
}

async function handleApproveRestaurant(id) {
    try {
        const response = await API.restaurants.approve(id);

        if (response.success) {
            Utils.showToast('Restaurante aprobado correctamente', 'success');
            await loadPendingRestaurants();
        }
    } catch (error) {
        console.error('Error approving restaurant:', error);
        Utils.showToast('Error al aprobar restaurante', 'error');
    }
}

async function handleRejectRestaurant(id) {
    try {
        const response = await API.restaurants.delete(id);

        if (response.success) {
            Utils.showToast('Restaurante rechazado y eliminado', 'success');
            await loadPendingRestaurants();
        }
    } catch (error) {
        console.error('Error rejecting restaurant:', error);
        Utils.showToast('Error al rechazar restaurante', 'error');
    }
}

async function loadCategories() {
    const loader = document.getElementById('categoriesLoader');
    const list = document.getElementById('categoriesList');

    try {
        loader.style.display = 'flex';

        const response = await API.categories.getAll();

        if (response.success && response.data.categories) {
            list.innerHTML = response.data.categories.map(category => createCategoryCard(category)).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        Utils.showToast('Error al cargar categorías', 'error');
    } finally {
        loader.style.display = 'none';
    }
}

function createCategoryCard(category) {
    return `
    <div class="category-card">
      <h3 class="category-name">${Utils.sanitizeHTML(category.name)}</h3>
      ${category.description ? `
        <p class="category-description">${Utils.sanitizeHTML(category.description)}</p>
      ` : ''}
      <p class="category-count">Creada el ${Utils.formatDate(category.createdAt)}</p>
    </div>
  `;
}

async function loadUsers() {
    const loader = document.getElementById('usersLoader');
    const list = document.getElementById('usersList');

    try {
        loader.style.display = 'flex';

        const response = await API.users.getAll();

        if (response.success && response.data.users) {
            list.innerHTML = response.data.users.map(user => createUserCard(user)).join('');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        Utils.showToast('Error al cargar usuarios', 'error');
    } finally {
        loader.style.display = 'none';
    }
}

function createUserCard(user) {
    const roleClass = user.role === 'admin' ? 'role-admin' : 'role-user';
    const roleText = user.role === 'admin' ? 'Admin' : 'Usuario';

    return `
    <div class="admin-card">
      <div class="admin-card-header">
        <div class="admin-card-info">
          <h3 class="admin-card-title">${Utils.sanitizeHTML(user.username)}</h3>
          <p class="admin-card-subtitle">${Utils.sanitizeHTML(user.email)}</p>
        </div>
        <span class="user-role-badge ${roleClass}">${roleText}</span>
      </div>

      <div class="admin-card-meta">
        <span>Registrado: ${Utils.formatDate(user.createdAt)}</span>
      </div>
    </div>
  `;
}

function initCategoryModal() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const modal = document.getElementById('addCategoryModal');
    const closeBtn = document.getElementById('closeCategoryModalBtn');
    const cancelBtn = document.getElementById('cancelCategoryBtn');
    const form = document.getElementById('addCategoryForm');
    const overlay = modal?.querySelector('.modal-overlay');

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                form?.reset();
                document.getElementById('categoryModalError').style.display = 'none';
            }, 300);
        }
    }

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateCategory();
    });
}

async function handleCreateCategory() {
    const submitBtn = document.getElementById('submitCategoryBtn');
    const modalError = document.getElementById('categoryModalError');

    const data = {
        name: document.getElementById('categoryName').value.trim(),
        description: document.getElementById('categoryDescription').value.trim() || undefined
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando...';
    modalError.style.display = 'none';

    try {
        const response = await API.categories.create(data);

        if (response.success) {
            Utils.showToast('Categoría creada correctamente', 'success');
            const modal = document.getElementById('addCategoryModal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('addCategoryForm').reset();
            }, 300);
            await loadCategories();
        }
    } catch (error) {
        console.error('Error creating category:', error);
        modalError.textContent = error.message || 'Error al crear la categoría';
        modalError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear Categoría';
    }
}
