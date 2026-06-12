/*This script is used for linking common HTML elements across all pages, thus minimizing code repetition.
* Common HTML elements are extracted from index.html and then inserted to the respective fields in other pages.*/

// NAVIGATION BAR
$(function() {
    // Function to update active class based on current page
    function setActiveNavLink() {
        // Get current page filename (e.g., "about.html", "index.html")
        let currentPage = window.location.pathname.split("/").pop();
        if (currentPage === "" || currentPage === "index.html") {
            currentPage = "index.html";
        }

        // Loop through all nav links and add 'active fw-bold' to matching href
        $("#nav_placeholder .nav-link").each(function() {
            let linkHref = $(this).attr("href");
            if (linkHref === currentPage) {
                $(this).addClass("active fw-bold").attr("aria-current", "page");
            } else {
                $(this).removeClass("active fw-bold").removeAttr("aria-current");
            }
        });
    }

    // If we are on index.html, the navbar is already present, just update classes on the existing navbar.
    if (window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "") {
        setActiveNavLink();
    }
    else {
        // For other pages: load navbar from index.html, then update active class
        $("#nav_placeholder").load("index.html #nav_placeholder", function() {
            setActiveNavLink();
        });
    }
});

// FOOTER
$(function() {
    if (window.location.pathname.includes("index.html")) return;
    //Extract the requested elements from the source and place them in the respective fields of the destination page.
    $("footer").load("index.html footer");
});



