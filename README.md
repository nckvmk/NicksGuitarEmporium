THE AMERICAN COLLEGE OF GREECE<br>
ITC4214 - INTERNET PROGRAMMING<br>
SUMMER TERM 2026<br>
NIKOLAOS VAMVAKAS (279123)

**DETAILED REPORT OF MIDTERM COURSEWORK "NICK'S GUITAR EMPORIUM"**

==============================================================

**PART A: TASK ALLOCATION SYSTEM**

OVERVIEW<br>
The task management system is a full-featured CRUD (Create, Read, Update, Delete) application integrated into the tasks page. It allows business users to manage their daily tasks with persistent storage, filtering, sorting, and activity tracking. The system is designed to be simple, intuitive, and fully functional without requiring a backend server.
<br>
<br>-----------------------------------------------------------------------------------------------------------

**1. Data Model<br>**
   Each task is stored as an object with the following properties:
   
| Field       | Type             | Description                            |
|-------------|------------------|----------------------------------------|
| id          | integer          | Unique identifier                      |
| name        | string           | Task title (req)                       |
| description | string           | Detailed description of the task (req) |
| duedate     | date(yyyy-mm-dd) | Deadlien fro completion (req)          |
| status      | Enum             | Task state (defaults to "Pending")     |
<br>
<br>------------------------------------------------------------------------------------------------------------

**2. User Interface Components<br>**

2.1. Task Table<br>
Located below the table, this form accepts three inputs:<br><br>
    a. Task Name<br>
    b. Task Description<br>
    c. Due Date<br>
    d. Status (colored text: yellow for Pending, green for Completed)<br>
    e. Actions (three buttons per row)<br><br>

2.2. Filter Dropdown<br>
Located above the table, allows filtering tasks by status:<br><br>
   a. All – shows every task<br>
   b. Pending – shows only tasks with "Pending" status<br>
   c. Completed – shows only tasks with "Completed" status<br><br>

2.3. Sort buttons<br>
Inline buttons in the table headers:<br><br>
a. Task Name – sorts alphabetically (A→Z or Z→A)<br>
b. Due Date – sorts chronologically (oldest first or newest first)<br>
Clicking cycles through three states: none → ascending → descending → none<br><br>

2.4. Add Task Form<br>
Located below the table, this form accepts three inputs:<br><br>
a. Task Name – text input<br>
b. Task Description – text input<br>
c. Due Date – date picker input<br>
A Submit button triggers the creation of a new task with "Pending" status.
<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------


**3. Core Features**<br>

3.1. Add Task<br>
A task is added by filling the forms and clicking submit. Input validation ensures that all fields are filled. Then a new task is created with:<br><br>
a. Auto-incremented ID<br>
b. Provided name, description, due date<br>
c. Status set to "Pending"<br><br>
Following that, the task is saved to localStorage, the table is re-rendered instantly, the activity is logged (Added action with task name and due date), and a confirmation alert appears.<br><br>

3.2. Edit Task<br>
To edit a task, the user clicks the Edit button of the desired task and three prompt dialogs appear:<br><br>
a. Task Name<br>
b. Description<br>
c. Due Date <br><br>
All three prompts are pre-filled with current data and the user can either leave them as they are to not make a change or input the new entry. Changes are then saved to localStorage, the table is re-rendered instantly and the activity is logged (edited action with old name->new name)
<br>
<br>

3.3. Delete Task<br>
To delete a task, the user simply clicks the Delete button of the desired task and a confirmation dialog appears to prevent any unwanted action. If confirmed, the task is then removed from the array and localStorage, the table is re-rendered instantly and the activity gets logged (deleted action with task name).<br><br>

3.4. Mark as Completed<br>
To mark a task as "Completed", the user simply clicks the "Mark as Complete" button of a pending task. Then, a confirmation dialog appears to prevent any unwanted action. If confirmed, the task's status is then changed from "Pending" to "Completed". Changes are saved to localStorage, the table is re-rendered instantly and the activity is logged (completed action with task name).<br><br>

3.5. Filter Tasks<br>
Tasks are filtered based on status, which is determined by the 4th column. To apply a filter, the user selects a status from the dropdown menu and the relevant table rows are immediately shown or hidden based on the filter. It works in conjuction with sorting.<br><br>

3.5. Sort Tasks<br>
Tasks are sorted based on task name or due date, in ascending or descending order. The user simply clicks a sort button in the following cycle:<br><br>
a. ⇅ - no sorting<br>
b. ↑ - ascending (A→Z or oldest first)<br>
c. ↓ - descending (Z→A or newest first)<br><br>
Only one sort can be active at a time, so if the user tries to activate a second one the other one deactivates. After a sort is applied, the table is re-ordered and re-rendered instantly.
<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------

**4. Data Persistence**<br>

4.1. Storage Mechanism<br>
All date is stored in the browser's localStorage using CSV format with comma separated values. This approach was chosen for simplicity, easier inspection via DevTools, space efficiency and midterm-scope appropriateness since no backend is required.<br>

4.2. CSV structure<br>
Task attributes: id,name,description,dueDate,status<br>
Activities attributes: timestamp,action,taskName,details<br>

4.3. Data Flow<br>
The data flow goes as follows:<br><br>
User action -> Javascript logic -> Update tasks array -> Save as CSV to localStorage -> Re-render table -> Update activity log CSV -> Dashboard sync<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------

**5. Activity Logging**<br>

5.1. Purpose<br>
The activity log provides an audit-trail of all task-related actions, enabling business users to track who performed which action, monitor task progress over time and review history for accountability.<br>

5.2. Logged Actions<br>

| Action    | Trigger               | Logged Details       |
|-----------|-----------------------|----------------------|
| Added     | Form submission       | Task name, due date  |
| Edited    | Edit confirmation     | Old name -> New name |
| Deleted   | Delete confirmation   | Task name            |
| Completed | Complete confirmation | Task name            |



5.3. Storage<br>
In regards to the storing logic, there is a separate CSV key in localStorage for activities. The storage is limited to last 20 entries to prevent bloat. A timestamp is generated at the moment of action.
<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------

**6. Home Page Integration (Dashboard)**<br>

6.1. Latest Activity Feed<br>
The latest activity feed, located on index.html, reads the activities CSV from localStorage and displays most recent actions first in reverse chronological order. <br>

6.2. Task Statistics Dashboard<br>
The statistics section of the dashboard shows the number of Pending and Completed tasks. It visualizes the percentage of each task's status using a progress bar. The progress bar updates automatically when tasks are modified. A total task count is displayed underneath the progress bar.

6.3. Data Sync<br>
All features read and write from the same localStorage keys and changes made on tasks.html are immediately visible on index.html. Therefore, no backend, no API and no page refresh is required since the scripts do it all.
<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------

**7. Technical Implementation Highlights**<br>

7.1. jQuery Usage<br>
jQuery has been chosen over traditional Javascript for DOM manipulation (adding/removing table rows, updating attributes) and event handling (form submission, button clicks and dropdown changes).<br>

7.2. No Page Reloads<br>
All CRUD operations are performed via the scripts without refreshing the page. This coding decision provides instant feedback to the user, better user experience as well as consistent state management.

7.3. CSV parsing<br>
Custom functions convert between CSV strings and JavaScript arrays, avoiding external libraries and keeping the code lightweight.

7.4. Error Handling<br>
The add form has input validation that prevents the user from entering blank entries. Confirmation prompts are placed for destructive actions like delete or changing the task status. Finally, there is a default demo task for graceful fallback if localStorage is empty.
<br>
<br>
<br>-----------------------------------------------------------------------------------------------------------








