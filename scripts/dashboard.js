//A script to load tasks from localStorage and displays a simple bar chart on latest activity section of home page


$(document).ready(function() {

    /**
     * loadTasks()
     * Reads the CSV string from localStorage under the key 'tasks'.
     * Parses it into an array of task objects.
     */
    function loadTasks() {
        let csv = localStorage.getItem('tasks');
        if (!csv) return [];

        let lines = csv.split('\n');
        let headers = lines[0].split(',');
        let tasks = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            let values = lines[i].split(',');
            let task = {};
            headers.forEach((header, index) => {
                task[header.trim()] = values[index] ? values[index].trim() : '';
            });
            task.id = parseInt(task.id);
            tasks.push(task);
        }
        return tasks;
    }

    /**
     * renderDashboard()
     * Counts tasks by status and renders a bar chart.
     */
    function renderDashboard() {
        let tasks = loadTasks();
        let $container = $('#dashboard-stats');
        $container.empty();

        // If no tasks exist, show a message
        if (tasks.length === 0) {
            $container.html('<p class="text-muted">No tasks yet. Start adding tasks to see statistics.</p>');
            return;
        }

        // Count how many tasks are Pending and Completed
        let pendingCount = tasks.filter(t => t.status === 'Pending').length;
        let completedCount = tasks.filter(t => t.status === 'Completed').length;
        let total = tasks.length;

        // Calculate percentages (avoid division by zero)
        let pendingPercent = total > 0 ? (pendingCount / total) * 100 : 0;
        let completedPercent = total > 0 ? (completedCount / total) * 100 : 0;

        // Build the HTML for the chart
        let html = `
            <div class="d-flex justify-content-between align-items-center">
                <span><strong>Pending</strong> (${pendingCount})</span>
                <span>${pendingPercent.toFixed(0)}%</span>
            </div>
            <div class="progress mb-2" style="height: 20px;">
                <div class="progress-bar bg-warning" role="progressbar"
                     style="width: ${pendingPercent}%;"
                     aria-valuenow="${pendingPercent}" aria-valuemin="0" aria-valuemax="100">
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
                <span><strong>Completed</strong> (${completedCount})</span>
                <span>${completedPercent.toFixed(0)}%</span>
            </div>
            <div class="progress mb-2" style="height: 20px;">
                <div class="progress-bar bg-success" role="progressbar"
                     style="width: ${completedPercent}%;"
                     aria-valuenow="${completedPercent}" aria-valuemin="0" aria-valuemax="100">
                </div>
            </div>

            <div class="mt-2 text small">
                Total tasks: ${total}
            </div>
        `;

        $container.html(html);
    }

    // Initial render
    renderDashboard();

});