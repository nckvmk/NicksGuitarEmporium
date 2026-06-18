// Music Trivia injector script

// api.js - Simple Music Trivia
$(document).ready(function() {
    // Load trivia when page loads
    loadTrivia();

    function loadTrivia() {
        // Show loading
        $("#api-output").html('<p>Loading music trivia...</p>');

        // Fetch from API
        $.get("https://opentdb.com/api.php?amount=1&category=12", function(data) {
            if (data.results && data.results.length > 0) {
                let question = data.results[0];
                let html = '<div style="background: var(--base-variant); padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">';
                html += '<p style="color: var(--text-color);">' + question.question + '</p>';
                html += '<button class="btn btn-primary btn-sm" onclick="$(this).next().show()">Show Answer</button>';
                html += '<p style="color: #28a745; display: none; margin-top: 10px;"><strong>Answer: ' + question.correct_answer + '</strong></p>';
                html += '</div>';
                $("#api-output").html(html);
            }
        }).fail(function() {
            $("#api-output").html('<p style="color: red;">Could not load trivia. Please refresh.</p>');
        });
    }
});