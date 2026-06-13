/* This script is designed to filter the catalog based on div class of each card. There are three options: All, Guitars,
Amps. The user can access this filter from a dropdown menu.
 */

$(document).ready(function() {
    // When dropdown changes
    $("#filter_catalog").on("change", function() {
        let selected = $(this).val(); // "all", "guitar", or "amp"

        if (selected === "all") {
            // Show everything
            $(".guitar, .amp").show();
        } else {
            // Hide all
            $(".guitar, .amp").hide();
            // Then show only filtered items
            $("." + selected).show();
        }
    });
});