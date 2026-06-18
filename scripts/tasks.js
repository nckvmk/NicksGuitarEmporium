// tasks.js - Simple task manager with CSV storage

$(document).ready(function() {
    // Load tasks from CSV or use default
    function loadTasks() {
        let csv = localStorage.getItem('tasks');

        // Parse CSV: first line is header, rest are rows
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

    // Save tasks as CSV
    function saveTasks(tasks) {
        if (tasks.length === 0) {
            localStorage.setItem('tasks', 'id,name,description,dueDate,status');
            return;
        }
        let headers = ['id', 'name', 'description', 'dueDate', 'status'];
        let csv = headers.join(',') + '\n';
        tasks.forEach(task => {
            let row = headers.map(h => task[h] || '').join(',');
            csv += row + '\n';
        });
        localStorage.setItem('tasks', csv);
    }

    let tasks = loadTasks();

    // Generate new ID
    function getNextId() {
        let maxId = 0;
        tasks.forEach(t => { if (t.id > maxId) maxId = t.id; });
        return maxId + 1;
    }

    // Render table
    function renderTable() {
        let $tbody = $('#tasks_table tbody');
        $tbody.empty();
        if (tasks.length === 0) {
            $tbody.html('<tr><td colspan="5" class="text-center">No tasks yet.</td></tr>');
            return;
        }
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
                        <button class="btn btnComplete btn-success btn-sm" data-id="${task.id}">Mark as Complete</button>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
    }

    // Add task
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

    // Form submit
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
        this.reset();
        alert('Task added!');
    });

    // Button events
    $(document).on('click', '.btnDelete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Delete this task?')) deleteTask(id);
    });
    $(document).on('click', '.btnComplete', function() {
        let id = parseInt($(this).data('id'));
        if (confirm('Mark as completed?')) completeTask(id);
    });
    $(document).on('click', '.btnEdit', function() {
        let id = parseInt($(this).data('id'));
        editTask(id);
    });

    renderTable();
});