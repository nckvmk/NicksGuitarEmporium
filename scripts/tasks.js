/* tasks.js - Task manager with CSV storage, sorting based on task name and due date, filtering based on status.
   User input through relevant form. Each activity is logged to be displayed on home page.
 */

$(document).ready(function() {

    // ================================================================
    // 1. STATE VARIABLES
    // ================================================================

    /**
     * sortDateDirection – tracks the current sorting direction for due date.
     * Possible values: 'none', 'asc' (oldest first), 'desc' (newest first).
     */
    let sortDateDirection = 'none';

    /**
     * sortNameDirection – tracks the current sorting direction for task name.
     * Possible values: 'none', 'asc' (A→Z), 'desc' (Z→A).
     */
    let sortNameDirection = 'none';

    /**
     * tasks – the main array that holds all task objects.
     * Each task object: { id, name, description, dueDate, status }.
     */
    let tasks = [];


    // ================================================================
    // 2. DATA PERSISTENCE (Load / Save tasks to/from localStorage as CSV)
    // ================================================================

    /**
     * loadTasks()
     * Reads the CSV string from localStorage under the key 'tasks'.
     * Parses it into an array of task objects.
     * If no data exists, returns a default demo task.
     * @returns {Array} Array of task objects.
     */
    function loadTasks() {
        // Retrieve the CSV string from localStorage
        let csv = localStorage.getItem('tasks');

        // If nothing is stored, return a default task (so the table isn't empty)
        if (!csv) {
            return [{ id: 1, name: "Test1", description: "Testdesc", dueDate: "2026-06-15", status: "Pending" }];
        }

        // Split the CSV into lines (each line is a row)
        let lines = csv.split('\n');
        // The first line contains the column headers
        let headers = lines[0].split(',');
        let loadedTasks = [];

        // Loop through each subsequent line (data rows)
        for (let i = 1; i < lines.length; i++) {
            // Skip empty lines
            if (lines[i].trim() === '') continue;

            // Split the line by commas to get individual values
            let values = lines[i].split(',');
            let task = {};

            // Map each header to its corresponding value
            headers.forEach((header, index) => {
                task[header.trim()] = values[index] ? values[index].trim() : '';
            });

            // Ensure the ID is stored as a number (not a string)
            task.id = parseInt(task.id);
            loadedTasks.push(task);
        }
        return loadedTasks;
    }

    /**
     * saveTasks(tasksToSave)
     * Converts the given array of task objects into a CSV string
     * and stores it in localStorage under the key 'tasks'.
     * @param {Array} tasksToSave - Array of task objects.
     */
    function saveTasks(tasksToSave) {
        // If there are no tasks, store only the header row (empty table)
        if (tasksToSave.length === 0) {
            localStorage.setItem('tasks', 'id,name,description,dueDate,status');
            return;
        }

        // Define the column headers in order
        let headers = ['id', 'name', 'description', 'dueDate', 'status'];
        // Start the CSV with the header line
        let csv = headers.join(',') + '\n';

        // For each task, build a row by mapping each header to the task's property
        tasksToSave.forEach(task => {
            let row = headers.map(h => task[h] || '').join(',');
            csv += row + '\n';
        });

        // Write the full CSV string to localStorage
        localStorage.setItem('tasks', csv);
    }

    /**
     * reloadTasks()
     * Resets the 'tasks' array to the data currently stored in localStorage.
     * This is used to undo any in‑memory sorting and get back to the original order.
     */
    function reloadTasks() {
        tasks = loadTasks();
    }


    // ================================================================
    // 3. ACTIVITY LOGGING (Logs every action to a separate CSV in localStorage)
    // ================================================================

    /**
     * loadActivities()
     * Reads the CSV string from localStorage under the key 'activities'.
     * Parses it into an array of activity objects.
     * @returns {Array} Array of activity objects (timestamp, action, taskName, details).
     */
    function loadActivities() {
        let csv = localStorage.getItem('activities');
        if (!csv) return [];

        let lines = csv.split('\n');
        let headers = lines[0].split(',');
        let activities = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            let values = lines[i].split(',');
            let activity = {};
            headers.forEach((header, index) => {
                activity[header.trim()] = values[index] ? values[index].trim() : '';
            });
            activities.push(activity);
        }
        return activities;
    }

    /**
     * saveActivities(activities)
     * Converts the given array of activity objects into a CSV string
     * and stores it in localStorage under the key 'activities'.
     */
    function saveActivities(activities) {
        if (activities.length === 0) {
            localStorage.setItem('activities', 'timestamp,action,taskName,details');
            return;
        }
        let headers = ['timestamp', 'action', 'taskName', 'details'];
        let csv = headers.join(',') + '\n';
        activities.forEach(act => {
            let row = headers.map(h => act[h] || '').join(',');
            csv += row + '\n';
        });
        localStorage.setItem('activities', csv);
    }

    /**
     * logActivity(action, taskName, details)
     * Adds a new entry to the activity log.
     * The log is kept to the most recent 20 entries to avoid excessive storage.
     * action - One of: 'Added', 'Edited', 'Deleted', 'Completed'
     * taskName - The name of the task involved.
     * details - Optional extra information (e.g., old name → new name).
     */
    function logActivity(action, taskName, details = '') {
        // Get the current log
        let activities = loadActivities();

        // Create a human‑readable timestamp
        let now = new Date().toLocaleString();

        // Push the new activity
        activities.push({
            timestamp: now,
            action: action,
            taskName: taskName,
            details: details
        });

        // Limit the log to the last 20 entries (keeps storage small)
        if (activities.length > 20) {
            activities = activities.slice(-20);
        }

        // Save the updated log
        saveActivities(activities);
    }


    // ================================================================
    // 4. RENDER THE TABLE (Draws the tasks from the 'tasks' array)
    // ================================================================

    /**
     * renderTable()
     * Empties the <tbody> of the tasks table and rebuilds it
     * using the current 'tasks' array.
     * After building, it re‑applies the current filter (if any).
     */
    function renderTable() {
        // Select the table body
        let $tbody = $('#tasks_table tbody');
        // Clear any existing rows
        $tbody.empty();

        // If there are no tasks, show a friendly message
        if (tasks.length === 0) {
            $tbody.html('<tr><td colspan="5" class="text-center">No tasks yet.</td></tr>');
            return;
        }

        // Loop through each task and build a table row
        tasks.forEach(task => {
            // Choose a text colour based on status
            let statusClass = task.status === 'Completed' ? 'text-success' : 'text-warning';

            // Build the row HTML using a template literal
            let row = `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.description}</td>
                    <td>${task.dueDate}</td>
                    <td class="${statusClass} fw-bold">${task.status}</td>
                    <td>
                        <!-- data-id attribute stores the task ID for event handling -->
                        <button class="btn btnEdit btn-primary btn-sm" data-id="${task.id}">Edit</button>
                        <button class="btn btnDelete btn-danger btn-sm" data-id="${task.id}">Delete</button>
                        <button class="btn btnComplete btn-success btn-sm" data-id="${task.id}">Complete</button>
                    </td>
                </tr>
            `;
            // Append the row to the table body
            $tbody.append(row);
        });

        // After rendering, re‑apply the filter (so the dropdown state is respected)
        let currentFilter = $('#filterStatus').val() || 'all';
        filterTasks(currentFilter);
    }


    // ================================================================
    // 5. FILTERING (Show/hide rows based on status)
    // ================================================================

    /**
     * filterTasks(status)
     * Shows only rows whose status matches the given parameter.
     * status - 'all', 'Pending', or 'Completed'
     */
    function filterTasks(status) {
        let $rows = $('#tasks_table tbody tr');
        console.log('Filtering for:', status);
        if (status === 'all') {
            $rows.show();
        } else {
            $rows.each(function() {
                let rowStatus = $(this).find('td:nth-child(4)').text().trim();
                if (rowStatus === status) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    }


    // ================================================================
    // 6. SORTING (Reorders the tasks array and re‑renders)
    // ================================================================

    /**
     * sortTasks()
     * Reorders the 'tasks' array based on the active sort settings.
     * If both sort directions are 'none', it resets to the original order.
     * Only one sort (name or date) can be active at a time.
     */
    function sortTasks() {
        // If both sorts are turned off, reload from storage (original order)
        if (sortNameDirection === 'none' && sortDateDirection === 'none') {
            tasks = loadTasks();
            renderTable();
            return;
        }

        // Create a shallow copy of the tasks array (to avoid mutating the original)
        let sorted = [...tasks];

        // If name sorting is active, sort alphabetically
        if (sortNameDirection !== 'none') {
            sorted.sort((a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                // localeCompare returns negative if a < b, positive if a > b
                return sortNameDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
        }
        // Otherwise, if date sorting is active, sort chronologically
        else if (sortDateDirection !== 'none') {
            sorted.sort((a, b) => {
                let dateA = new Date(a.dueDate);
                let dateB = new Date(b.dueDate);
                return sortDateDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        // Replace the tasks array with the sorted version and re‑render
        tasks = sorted;
        renderTable();
    }


    // ================================================================
    // 7. CRUD OPERATIONS (Create, Read, Update, Delete)
    // ================================================================

    /**
     * getNextId()
     * Finds the highest existing task ID and returns the next integer.
     * @returns {number} Next available ID.
     */
    function getNextId() {
        let maxId = 0;
        tasks.forEach(t => { if (t.id > maxId) maxId = t.id; });
        return maxId + 1;
    }

    /**
     * addTask(name, description, dueDate)
     * Creates a new task with 'Pending' status, saves it, logs the action,
     * and re‑renders the table.
     */
    function addTask(name, description, dueDate) {
        tasks.push({
            id: getNextId(),
            name: name,
            description: description,
            dueDate: dueDate,
            status: 'Pending'
        });
        saveTasks(tasks);
        logActivity('Added', name, 'Due: ' + dueDate);
        renderTable();
    }

    /**
     * deleteTask(id)
     * Removes the task with the given ID, saves the changes, logs the action,
     * and re‑renders the table.
     */
    function deleteTask(id) {
        let task = tasks.find(t => t.id === id);
        if (!task) return; // Safety check
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(tasks);
        logActivity('Deleted', task.name);
        renderTable();
    }

    /**
     * completeTask(id)
     * Marks the task as 'Completed', saves, logs, and re‑renders.
     */
    function completeTask(id) {
        let task = tasks.find(t => t.id === id);
        if (!task) return;
        task.status = 'Completed';
        saveTasks(tasks);
        logActivity('Completed', task.name);
        renderTable();
    }

    /**
     * editTask(id)
     * Uses three prompt() dialogs to let the user change name, description, and due date.
     * Logs the change (showing old name → new name), saves, and re‑renders.
     */
    function editTask(id) {
        let task = tasks.find(t => t.id === id);
        if (!task) return;

        // Prompt for new values; if user cancels, abort
        let newName = prompt('Task Name:', task.name);
        if (newName === null) return;

        let newDesc = prompt('Description:', task.description);
        if (newDesc === null) return;

        let newDate = prompt('Due Date (YYYY-MM-DD):', task.dueDate);
        if (newDate === null) return;

        // Store old name for the log
        let oldName = task.name;

        // Update the task fields (keep old value if user left empty)
        task.name = newName.trim() || task.name;
        task.description = newDesc.trim() || task.description;
        task.dueDate = newDate.trim() || task.dueDate;

        // Save changes and log the edit
        saveTasks(tasks);
        logActivity('Edited', oldName, '→ ' + task.name);
        renderTable();
    }


    // ================================================================
    // 8. EVENT HANDLERS (Bind UI interactions to the logic above)
    // ================================================================

    // Load tasks from localStorage when the page first loads
    reloadTasks();

    // ----- Form submission (Add a new task) -----
    $('#tasks').on('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission (page reload)

        // Gather and trim the input values
        let name = $('#name').val().trim();
        let description = $('#description').val().trim();
        let dueDate = $('#deadline').val();

        // Simple validation: all fields must be filled
        if (!name || !description || !dueDate) {
            alert('All fields are required.');
            return;
        }

        // Add the task
        addTask(name, description, dueDate);

        // Reset the form fields
        this.reset();
        alert('Task added!');
    });

    // ----- Filter dropdown change -----
    $('#filterStatus').on('change', function() {
        filterTasks($(this).val());
    });

    // ----- Sort by Name button (cycles 'none' → 'asc' → 'desc' → 'none') -----
    $(document).on('click', '#sortName', function() {
        // Update the direction
        if (sortNameDirection === 'none') {
            sortNameDirection = 'asc';
            $('#sortNameIcon').text('↑');   // Ascending icon
        } else if (sortNameDirection === 'asc') {
            sortNameDirection = 'desc';
            $('#sortNameIcon').text('↓');   // Descending icon
        } else {
            sortNameDirection = 'none';
            $('#sortNameIcon').text('⇅');   // No sorting icon
        }

        // When name sort is active, deactivate date sort (mutually exclusive)
        if (sortNameDirection !== 'none') {
            sortDateDirection = 'none';
            $('#sortDateIcon').text('⇅');
        }

        // Apply the sort
        sortTasks();
    });

    // ----- Sort by Date button (same cycle logic) -----
    $(document).on('click', '#sortDate', function() {
        if (sortDateDirection === 'none') {
            sortDateDirection = 'asc';
            $('#sortDateIcon').text('↑');
        } else if (sortDateDirection === 'asc') {
            sortDateDirection = 'desc';
            $('#sortDateIcon').text('↓');
        } else {
            sortDateDirection = 'none';
            $('#sortDateIcon').text('⇅');
        }

        // Deactivate name sort when date sort is active
        if (sortDateDirection !== 'none') {
            sortNameDirection = 'none';
            $('#sortNameIcon').text('⇅');
        }

        sortTasks();
    });

    // ----- Delete button -----
    $(document).on('click', '.btnDelete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Delete this task?')) {
            deleteTask(id);
        }
    });

    // ----- Complete button -----
    $(document).on('click', '.btnComplete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Mark as completed?')) {
            completeTask(id);
        }
    });

    // ----- Edit button -----
    $(document).on('click', '.btnEdit', function() {
        let id = parseInt($(this).data('id'));
        editTask(id);
    });

    // Finally, render the table for the first time
    renderTable();

});