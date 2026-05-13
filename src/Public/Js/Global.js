document.addEventListener("DOMContentLoaded", function() {
    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    var toggle = document.getElementById('darkModeToggle');
    var toggleMobile = document.getElementById('darkModeToggleMobile');

    function updateDarkModeIcon() {
        var isDark = document.documentElement.classList.contains('dark');
        var iconClass = isDark ? 'fa-sun text-yellow-500' : 'fa-moon';
        var icons = document.querySelectorAll('#darkModeToggle i, #darkModeToggleMobile i');
        icons.forEach(function(icon) {
            icon.className = 'fas ' + iconClass + ' text-sm';
        });
    }

    function toggleDarkMode() {
        var html = document.documentElement;
        html.classList.toggle('dark');
        var isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateDarkModeIcon();
    }

    if (toggle) toggle.addEventListener('click', toggleDarkMode);
    if (toggleMobile) toggleMobile.addEventListener('click', toggleDarkMode);

    // Set initial icon state
    updateDarkModeIcon();
});
