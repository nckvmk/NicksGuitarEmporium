/* tasks.js - Task manager with CSV storage, sorting based on task name and due date, filtering based on status.
   User input through relevant form.
 */

// tasks.js - Complete task manager with CSV storage, filter, and sort
$(document).ready(function() {
    // Track sorting direction
    let sortDateDirection = 'none';  // 'none', 'asc', 'desc' for due date
    let sortNameDirection = 'none';  // 'none', 'asc', 'desc' for task name
    // Main tasks array - holds all task objects
    let tasks = [];

    /*
     Load tasks from localStorage (CSV format)
     If no data exists, return a default demo task
     */
    function loadTasks() {
        let csv = localStorage.getItem('tasks');
        if (!csv) {
            return [{ id: 1, name: "Test1", description: "Testdesc", dueDate: "2026-06-15", status: "Pending" }];
        }

        // Parse CSV: split into lines, first line is headers
        let lines = csv.split('\n');
        let headers = lines[0].split(',');
        let loadedTasks = [];

        // Loop through each data row (skip header row)
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            let values = lines[i].split(',');
            let task = {};

            // Map each value to its corresponding header
            headers.forEach((header, index) => {
                task[header.trim()] = values[index] ? values[index].trim() : '';
            });
            task.id = parseInt(task.id);
            loadedTasks.push(task);
        }
        return loadedTasks;
    }

    /*
      Save tasks array to localStorage as CSV
      Converts array of objects to comma-separated values
     */
    function saveTasks(tasksToSave) {
        if (tasksToSave.length === 0) {
            localStorage.setItem('tasks', 'id,name,description,dueDate,status');
            return;
        }

        let headers = ['id', 'name', 'description', 'dueDate', 'status'];
        let csv = headers.join(',') + '\n';

        tasksToSave.forEach(task => {
            let row = headers.map(h => task[h] || '').join(',');
            csv += row + '\n';
        });

        localStorage.setItem('tasks', csv);
    }

    /*
     Reload tasks from storage (resets any sorting/filtering)
     */
    function reloadTasks() {
        tasks = loadTasks();
    }

    /*
     Render the tasks table from the 'tasks' array
     Creates one table row per task with action buttons
     */
    function renderTable() {
        let $tbody = $('#tasks_table tbody');
        $tbody.empty();

        if (tasks.length === 0) {
            $tbody.html('<tr><td colspan="5" class="text-center">No tasks yet.</td></tr>');
            return;
        }

        // Build each row
        tasks.forEach(task => {
            let statusClass = task.status === 'Completed' ? 'text-success' : 'text-warning';
            let row = `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.description}</td>
                    <td>${task.dueDate}</td>
                    <td class="${statusClass} fw-bold">${task.status}</td>
                    <td>
                        <button class="btn btnEdit btn-primary btn-sm" data-id="${task.id}">Edit</button>
                        <button class="btn btnDelete btn-danger btn-sm" data-id="${task.id}">Delete</button>
                        <button class="btn btnComplete btn-success btn-sm" data-id="${task.id}">Complete</button>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });

        // Re-apply filter after rendering
        let currentFilter = $('#filterStatus').val() || 'all';
        filterTasks(currentFilter);
    }

    /*
    Filtering
     Show/hide table rows based on task status
     @param {string} status - 'all', 'Pending', or 'Completed'
     */
    function filterTasks(status) {
        let $rows = $('#tasks_table tbody tr');

        if (status === 'all') {
            $rows.show();
        } else {
            $rows.each(function() {
                // Status is in the 4th column (index 3)
                let rowStatus = $(this).find('td:nth-child(4)').text().trim();
                $(this).toggle(rowStatus === status);
            });
        }
    }

    /*
    Sorting
     Sort tasks based on the active sort settings.
     If both are 'none', reset to original order.
     Priority: name sort if active, otherwise date sort.
     (Only one sort can be active at a time; we could also combine,
     but for simplicity we'll let the last clicked button take effect.)
     */
    function sortTasks() {
        // If both are none, reset to original order
        if (sortNameDirection === 'none' && sortDateDirection === 'none') {
            tasks = loadTasks();
            renderTable();
            return;
        }

        // Create a copy to sort
        let sorted = [...tasks];

        // Determine which sort to apply (prefer name if active, else date)
        if (sortNameDirection !== 'none') {
            // Sort by name (string comparison)
            sorted.sort((a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                if (sortNameDirection === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        } else if (sortDateDirection !== 'none') {
            // Sort by due date
            sorted.sort((a, b) => {
                let dateA = new Date(a.dueDate);
                let dateB = new Date(b.dueDate);
                return sortDateDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        tasks = sorted;
        renderTable();
    }

    /*
     Generate a new unique ID for tasks
     Finds the highest existing ID and adds 1
     */
    function getNextId() {
        let maxId = 0;
        tasks.forEach(t => { if (t.id > maxId) maxId = t.id; });
        return maxId + 1;
    }

    //Add a new task with 'Pending' status
    function addTask(name, description, dueDate) {
        tasks.push({
            id: getNextId(),
            name: name,
            description: description,
            dueDate: dueDate,
            status: 'Pending'
        });
        saveTasks(tasks);
        renderTable();
    }

    //Delete a task by its ID
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(tasks);
        renderTable();
    }

    //Mark a task as 'Completed'
    function completeTask(id) {
        tasks.forEach(t => {
            if (t.id === id) t.status = 'Completed';
        });
        saveTasks(tasks);
        renderTable();
    }

    /*
     Edit a task using prompt() dialogs
     (Simplest approach for midterm scope)
     */
    function editTask(id) {
        let task = tasks.find(t => t.id === id);
        if (!task) return;

        let newName = prompt('Task Name:', task.name);
        if (newName === null) return;

        let newDesc = prompt('Description:', task.description);
        if (newDesc === null) return;

        let newDate = prompt('Due Date (YYYY-MM-DD):', task.dueDate);
        if (newDate === null) return;

        // Update only if user provided new values
        task.name = newName.trim() || task.name;
        task.description = newDesc.trim() || task.description;
        task.dueDate = newDate.trim() || task.dueDate;

        saveTasks(tasks);
        renderTable();
    }

    // Initialize tasks on page load
    reloadTasks();

    /*
     Form submission - adds a new task
     Validates that all fields are filled
     */
    $('#tasks').on('submit', function(e) {
        e.preventDefault();

        let name = $('#name').val().trim();
        let description = $('#description').val().trim();
        let dueDate = $('#deadline').val();

        if (!name || !description || !dueDate) {
            alert('All fields are required.');
            return;
        }

        addTask(name, description, dueDate);
        this.reset(); // Clear the form
        alert('Task added!');
    });

    //Filter dropdown - shows/hides tasks by status
    $('#filterStatus').on('change', function() {
        filterTasks($(this).val());
    });

    /*
     Sort by Name button - cycles: none → asc → desc → none
     When name sort is active, it disables date sort (sets to 'none')
     */
    $(document).on('click', '#sortName', function() {
        // Cycle name direction
        if (sortNameDirection === 'none') {
            sortNameDirection = 'asc';
            $('#sortNameIcon').text('↑');
        } else if (sortNameDirection === 'asc') {
            sortNameDirection = 'desc';
            $('#sortNameIcon').text('↓');
        } else {
            sortNameDirection = 'none';
            $('#sortNameIcon').text('⇅');
        }
        // Deactivate date sort if name sort is now active
        if (sortNameDirection !== 'none') {
            sortDateDirection = 'none';
            $('#sortDateIcon').text('⇅');
        }
        sortTasks();
    });

    /*
     Sort by Date button - cycles: none → asc → desc → none
     When date sort is active, it disables name sort (sets to 'none')
     */
    $(document).on('click', '#sortDate', function() {
        // Cycle date direction
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
        // Deactivate name sort if date sort is now active
        if (sortDateDirection !== 'none') {
            sortNameDirection = 'none';
            $('#sortNameIcon').text('⇅');
        }
        sortTasks();
    });

    /*
     Delete button - removes the task
     Uses data-id attribute to identify which task
     */
    $(document).on('click', '.btnDelete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Delete this task?')) deleteTask(id);
    });

    /*
     Complete button - marks task as Completed
     */
    $(document).on('click', '.btnComplete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Mark as completed?')) completeTask(id);
    });

    /*
     Edit button - opens prompt dialogs to edit task fields
     */
    $(document).on('click', '.btnEdit', function() {
        let id = parseInt($(this).data('id'));
        editTask(id);
    });

    // Initial render of the table
    renderTable();

});