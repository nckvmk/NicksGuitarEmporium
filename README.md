THE AMERICAN COLLEGE OF GREECE<br>
ITC4214 - INTERNET PROGRAMMING<br>
SUMMER TERM 2026<br>
NIKOLAOS VAMVAKAS (279123)<br>
PROF. LEONARDOS MAGEIROS

**DETAILED REPORT OF MIDTERM COURSEWORK "NICK'S GUITAR EMPORIUM"**

==============================================================

**PART A: TASK ALLOCATION SYSTEM & ACTIVITY LOGGING**

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
<br>-----------------------------------------------------------------------------------------------------------

**6. Home Page Integration (Dashboard)**<br>

6.1. Latest Activity Feed<br>
The latest activity feed, located on index.html, reads the activities CSV from localStorage and displays most recent actions first in reverse chronological order. <br>

6.2. Task Statistics Dashboard<br>
The statistics section of the dashboard shows the number of Pending and Completed tasks. It visualizes the percentage of each task's status using a progress bar. The progress bar updates automatically when tasks are modified. A total task count is displayed underneath the progress bar.

6.3. Data Sync<br>
All features read and write from the same localStorage keys and changes made on tasks.html are immediately visible on index.html. Therefore, no backend, no API and no page refresh is required since the scripts do it all.
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


==============================================================


**PART B: THE STORE CATALOG (MY PERSONAL PAGE)**<br><br>

OVERVIEW<br>
The Catalog page (catalog.html) serves as the virtual showroom for Nick's Guitar Emporium. It displays the store's inventory of vintage guitars and amplifiers in a visually appealing, user‑friendly grid layout. This page was chosen as the "extra page" for the project because an inventory catalog is the most appropriate and functional addition for a guitar shop website. It allows visitors to browse available items, view detailed information, and get a sense of the store's collection before visiting in person or making an inquiry. Key features of this page:<br><br>
a. Responsive grid layout: Adaptive to any screen size using Bootstrap's grid system<br>
b. Product cards: Each item displays a carousel of images, a title, a description, and a price<br>
c. YouTube video integration: Each product includes a video demo in the carousel so users can hear the instrument or amplifier<br>
d. Filter functionality: Users can filter the catalog to show "All", "Guitars", or "Amps" instantly<br>
e. Home page integration: The first row of items is automatically extracted and displayed on the home page as "Just In" items<br>
f. Read‑only catalog: Users cannot make purchases directly, transactions are handled in‑store or through Reverb.
<br>
<br>-----------------------------------------------------------------------------------------------------------

**1. Design Choices<br>**

1.1. Grid Layout with Cards<br>
The catalog uses Bootstrap's responsive grid system with product cards. This design was chosen for several reasons:<br><br>
a. Uniform look: All products are displayed with consistent sizing and styling<br>
b. Better UX: Cards present information clearly and are easy to scan<br>
c. Responsive: The grid adapts to any screen size (1 column on mobile, 2 on tablet, 3 on desktop)<br>
d. Scalable: New products can be added by simply duplicating a card template<br>
e. Visual hierarchy: Images, titles, descriptions, and prices are logically structured<br><br>

1.2. Carousel with Video Integration<br>
Each product features a Bootstrap 5 carousel that includes:<br><br>
a. Multiple images showing the item from different angles<br>
b. Youtube video embedded as the final slide. By including a video demo of the item, the catalog gives better evaluation to the user for the item in question, it builds trust given that potential buyers are more confident before visiting the store and reduces uncertainty. Moreover, it provides the user with an engaging experience that make the catalog fell more interactive and informative.<br><br>

1.3. Aspect Ratio Matching<br>
The carousel maintains a consistent height across all slides using CSS. The benefits of this approach being that images and videos fill the same space alas preventing size changes when sliding and ensures functionality across all devices. Overall, aspect ratio matching gives the carousel slides a professional and polished appearance.<br><br>

1.4. Read-only Catalog<br>
The catalog is intentionally read-only, there is no shopping car or checkout method. This decision was made because:<br><br>
a. Business model: Transactions are processed in-store or through Reverb<br>
b. Customer experience: for high‑value vintage music gear, buyers prefer to try before buying<br>
c. Trust: the store focuses on building relationships, not just making sales<br>
d. Scope: Implementing e‑commerce would require a backend and payment processing, which is beyond the midterm's scope<br><br>
Therefore, the catalog serves as a virtual showroom that encourages customers to visti the store or contact the team.
<br>
<br>-----------------------------------------------------------------------------------------------------------

**2. Implementation Details<br>**

2.1. Product Categorisation<br>
Each product card has a class that identifies its category:<br>

| Category | Class  | HTML tag           |
|----------|--------|--------------------|
| Guitars  | guitar | class="guitar col" |
| Amps     | amp    | class="amp col"    |
<br>
This class is used by the filter script to show/hide items based on user selection.<br><br>


2.2. Filtering Logic<br>
The filtering script(catalog_filtering.js) uses jQuery to provide instant, client‑side filtering with no page reload.<br><br>
How it works:<br>
a. User selects a filter option from the dropdown<br>
b. jQuery captures the "change" event<br>
c. If "All" is selected, then all items become visible.<br>
d. If "Guitars" or "Amps" is selected, all items are hidden then only the matching category is shown<br>

The benefits of DOM manipulation is that it provides instant results, it is simple code-wise and easily maintainable when it comes to adding new categories.<br><br>

2.3. Image Popup on Click<br>
The carousel.js script serves the purpose of opening up a carousel image in a new browser tab at full resolution, whenever the user clicks on it. This feature not only allows users to view an image in high-res, but it is also very useful for inspecting condition, wear and craftmanship. Moreover, it is a simple implementation with no extra libraries.<br><br>

1.4. Read-only Catalog<br>
The catalog is intentionally read-only, there is no shopping car or checkout method. This decision was made because:<br><br>
a. Business model: Transactions are processed in-store or through Reverb<br>
b. Customer experience: for high‑value vintage music gear, buyers prefer to try before buying<br>
c. Trust: the store focuses on building relationships, not just making sales<br>
d. Scope: Implementing e‑commerce would require a backend and payment processing, which is beyond the midterm's scope<br><br>
Therefore, the catalog serves as a virtual showroom that encourages customers to visti the store or contact the team.
<br>
<br>-----------------------------------------------------------------------------------------------------------











