// ============================================
// DARK MODE TOGGLE (global for all layouts)
// ============================================
function toggleDarkMode() {
    var html = document.documentElement;
    html.classList.toggle('dark');
    var isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeIcons();
}

function updateDarkModeIcons() {
    var isDark = document.documentElement.classList.contains('dark');
    var iconClass = isDark ? 'fa-sun text-yellow-500' : 'fa-moon';
    document.querySelectorAll('#darkModeToggle i, #darkModeToggleMobile i, .admin-dark-icon').forEach(function(icon) {
        icon.className = 'fas ' + iconClass + ' text-sm';
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Set initial dark mode icons
    updateDarkModeIcons();
});
