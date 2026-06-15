/* This script is used for linking common HTML elements across all pages, thus minimizing code repetition.
* Common HTML elements are extracted from index.html and then inserted to the respective fields in other pages. */

// NAVIGATION BAR
$(function() {
    // Function to update active class based on current page
    function setActiveNavLink() {
        // Get current page filename (e.g., "about.html", "index.html")
        let currentPage = window.location.pathname.split("/").pop();
        if (currentPage === "" || currentPage === "index.html") {
            currentPage = "index.html";
        }

        // Loop through all nav links and add 'active' to matching href
        $("#nav_placeholder .nav-link").each(function() {
            let linkHref = $(this).attr("href");
            if (linkHref === currentPage) {
                $(this).addClass("active").attr("aria-current", "page");
            } else {
                $(this).removeClass("active").removeAttr("aria-current");
            }
        });
    }

    // If we are on index.html, the navbar is already present, just update classes on the existing navbar.
    if (window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "") {
        setActiveNavLink();
        // After navbar is loaded, refresh the theme button icon
        if (typeof refreshThemeButton === 'function') {
            refreshThemeButton();
        }
    }
    else {
        // For other pages: load navbar from index.html, then update active class
        $("#nav_placeholder").load("index.html #nav_placeholder", function() {
            setActiveNavLink();
            // After navbar is loaded, refresh the theme button icon
            if (typeof refreshThemeButton === 'function') {
                refreshThemeButton();
            }
        });
    }
});

// RECENT ITEMS
$(function() {
    // Only run on index.html
    if (!window.location.pathname.endsWith("index.html") &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "") {
        return;
    }
    // Load the catalog page's product container
    $("#product_catalog").load("catalog.html #product_catalog", function() {
        // Find the first row of cards
        let $firstRow = $("#product_catalog .row").first();
        // Keep only the first 3 columns (cards) in that row
        $firstRow.find(".col").slice(3).remove();
        // Replace the entire content with just this trimmed row
        $("#product_catalog").empty().append($firstRow);
    });
})

// FOOTER
$(function() {
    // Ensure that source page is index.html
    if (window.location.pathname.includes("index.html")) return;
    // Extract the footer from the source and place it in the respective field of the destination page.
    $("footer").load("index.html footer");
});



