// A script to display latest activities done on tasks, on the home page

$(document).ready(function() {

    /**
     * loadActivities()
     * Reads the CSV string from localStorage under the key 'activities'.
     * Parses it into an array of activity objects.
     * Array of activity objects (timestamp, action, taskName, details).
     */
    function loadActivities() {
        // Get the CSV string from localStorage
        let csv = localStorage.getItem('activities');
        // If nothing is stored, return an empty array
        if (!csv) return [];

        // Split by lines
        let lines = csv.split('\n');
        // The first line contains the headers
        let headers = lines[0].split(',');
        let activities = [];

        // Parse each data row
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue; // skip empty lines
            let values = lines[i].split(',');
            let activity = {};
            // Map each header to its corresponding value
            headers.forEach((header, index) => {
                activity[header.trim()] = values[index] ? values[index].trim() : '';
            });
            activities.push(activity);
        }
        return activities;
    }

    /**
     * renderActivities()
     * Builds an HTML list of the latest activities and injects it into
     * the element with id 'activity-feed'.
     * The list is shown with the most recent activity first.
     */
    function renderActivities() {
        // Load the activities from storage
        let activities = loadActivities();
        let $feed = $('#activity-feed');

        // Clear any previous content
        $feed.empty();

        // If there are no activities, show a friendly message
        if (activities.length === 0) {
            $feed.html('<p class="text-muted">No recent activity.</p>');
            return;
        }

        // Make a copy and reverse it so the newest is first
        let latest = activities.slice().reverse();

        // Start building the HTML for a Bootstrap list group
        let html = '<ul class="list-group">';

        // Loop through each activity and create a list item
        latest.forEach(act => {
            // Choose an appropriate emoji icon for the action type
            let icon = '';
            switch (act.action) {
                case 'Added':      break;
                case 'Edited':     break;
                case 'Deleted':    break;
                case 'Completed':  break;
                default:           icon = '📌';
            }

            // Build the list item with Bootstrap classes
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                        <span>${icon}</span>
                        <strong>${act.action}</strong> task
                        <span class="fw-bold">“${act.taskName}”</span>
                        ${act.details ? '<span class="text-muted small">' + act.details + '</span>' : ''}
                    </div>
                    <span class="badge bg-secondary rounded-pill">${act.timestamp}</span>
                </li>
            `;
        });

        html += '</ul>';

        // Insert the generated HTML into the feed container
        $feed.html(html);
    }

    // ----- Initial render when the page loads -----
    renderActivities();

});