document.addEventListener('DOMContentLoaded', () => {
    alertify.set('notifier', 'position', 'top-right');

    // ============================================
    // TAB SWITCHING
    // ============================================
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-gray-900 shadow-sm';
            registerTab.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700';
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });

        registerTab.addEventListener('click', () => {
            registerTab.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-gray-900 shadow-sm';
            loginTab.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700';
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }

    // ============================================
    // ROLE SELECTION
    // ============================================
    const roleUser = document.getElementById('role-user');
    const roleCompany = document.getElementById('role-company');
    const roleInput = document.getElementById('reg-role');
    const companyField = document.getElementById('company-name-field');

    function selectRole(role) {
        if (role === 'company') {
            roleUser.className = 'role-selector flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white transition-all duration-200';
            roleCompany.className = 'role-selector flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50/30 transition-all duration-200';
            companyField.classList.remove('hidden');
            roleInput.value = 'company';
        } else {
            roleCompany.className = 'role-selector flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white transition-all duration-200';
            roleUser.className = 'role-selector flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50/30 transition-all duration-200';
            companyField.classList.add('hidden');
            roleInput.value = 'user';
        }
    }

    if (roleUser) roleUser.addEventListener('click', () => selectRole('user'));
    if (roleCompany) roleCompany.addEventListener('click', () => selectRole('company'));

    // ============================================
    // LOGIN
    // ============================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('login-remember')?.checked || false;

            if (!email || !password) {
                alertify.error('Email və şifrə daxil edin');
                return;
            }

            try {
                const res = await axios.post('/api/auth/login', { email, password, rememberMe });
                if (res.status === 200) {
                    alertify.success(res.data.message);
                    // Redirect based on role
                    const role = res.data.user.role;
                    if (role === 'company') {
                        window.location.href = '/company/dashboard';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }
            } catch (err) {
                const msg = err.response?.data?.error || 'Xəta baş verdi';
                alertify.error(msg);
            }
        });
    }

    // ============================================
    // REGISTER
    // ============================================
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value.trim();
            const surname = document.getElementById('reg-surname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const role = document.getElementById('reg-role').value;
            const companyName = document.getElementById('reg-company-name')?.value.trim();

            // Validation
            if (!name || !surname || !email || !password || !confirmPassword) {
                alertify.error('Bütün məcburi xanaları doldurun');
                return;
            }
            if (password.length < 6) {
                alertify.error('Şifrə ən az 6 simvol olmalıdır');
                return;
            }
            if (password !== confirmPassword) {
                alertify.error('Şifrələr uyğun gəlmir');
                return;
            }
            if (role === 'company' && !companyName) {
                alertify.error('Şirkət adını daxil edin');
                return;
            }

            try {
                const res = await axios.post('/api/auth/register', {
                    name, surname, email, phone, password,
                    confirmPassword, role, companyName
                });

                if (res.status === 201) {
                    alertify.success(res.data.message);
                    const userRole = res.data.user.role;
                    if (userRole === 'company') {
                        window.location.href = '/company/dashboard';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }
            } catch (err) {
                const msg = err.response?.data?.error || 'Xəta baş verdi';
                alertify.error(msg);
            }
        });
    }
});
