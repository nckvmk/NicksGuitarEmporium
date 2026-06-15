//This script serves the purpose of making the theme switch button on the nav bar functional for the user to switch themes dynamically

$(document).ready(function() {
    function updateTheme() {
        const isDark = localStorage.getItem('dark-mode') === 'active';
        if (isDark) {
            $('body').addClass('dark-mode');
            $('#theme-switch').html('#light');
        } else {
            $('body').removeClass('dark-mode');
            $('#theme-switch').html('#dark');
        }
    }

    updateTheme();
    
    $(document).on('click', '#theme-switch', function() {
        const isDark = localStorage.getItem('dark-mode') === 'active';
        if (isDark) {
            localStorage.setItem('dark-mode', null);
        } else {
            localStorage.setItem('dark-mode', 'active');
        }
        updateTheme();
    });
});
