/* This script is responsible for the dynamic data manipulation of the tasks table */

$(document).ready(function() {
    $(".btnDelete").on('click', function() {
        $(this).closest('tr').remove();
    });
})