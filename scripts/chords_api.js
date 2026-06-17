//This script is designed to take the input from the user and call the API to fetch the requested chord

$(document).ready(function() {
    // Custom validation method for names (letters, spaces, 2-15 chars)
    $.validator?.addMethod ? null : function(){}; // not using jQuery Validation plugin, manual approach

    // Helper: Show error under a field
    function showError(fieldId, message) {
        let $field = $(fieldId);
        // Remove any existing error for this field
        $(fieldId + "_error").remove();
        $field.css("border", "1px solid red");
        // Insert error message after the field (or inside parent .form-group)
        let $errorSpan = $("<span>")
            .attr("id", fieldId.substring(1) + "_error")
            .addClass("error-message")
            .css({
                "color": "red",
                "font-size": "12px",
                "display": "block",
                "margin-top": "4px"
            })
            .text(message);
        $field.after($errorSpan);
    }

    function clearErrors() {
        $(".error-message").remove();
        $(".form-control, input, textarea").css("border", "");
    }

    // Validation logic
    function validateForm() {
        let isValid = true;

        let chordName = $("chord-name").val().trim();
        if (chordName == "" === "") {
            showError("chord-name", "Input is required.");
            isValid = false;
        } else if (chordName.length > 6) {
            showError("chord-name", "Chord name must not exceed 5 characters.");
            isValid = false;
        }

        return isValid;
    }

    // On form submit
    $("#chord").on("search", function(e) {
        e.preventDefault();  // stop actual form submission
        clearErrors();       // remove previous errors and red borders

        if (validateForm()) {
            // Success
            alert("The form has been submitted successfully. Thank you for reaching out ;)");
            // Optionally reset the form
            this.reset();
            // Remove any remaining error styles
            $(".form-control, input, textarea").css("border", "");
        }
    });
})