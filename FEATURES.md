# Feature Guidelines

This document has been updated to reflect the implemented views in the complaint management system. It outlines the features available to each user type: **Admin**, **Lupon Member**, and **Citizen**. Each feature includes a description, the views that support it, what it contains, user actions, and its purpose.

---

## **Citizen Features**

### 1. User Registration and Authentication

- **Routes**:
  - `POST /register`
  - `POST /login`
  - `POST /logout`

- **Description**: Allows citizens to create an account, log in, and log out of the system.

- **Contains**:
  - Registration form requiring email, phone number, full name, and address details (purok, street, block number, house number).
  - Login form for entering email and password.
  - Logout functionality to securely end the session.

- **User Actions**:
  - **Register**: Submit personal and contact information to create an account.
  - **Login**: Enter credentials to access the system.
  - **Logout**: Safely exit the system.

- **Purpose**: To establish a secure and unique identity for each citizen, enabling personalized access to system features.

---

### 2. Profile Management

- **Routes**:
  - `GET /profile`
  - `PUT /profile/edit`

- **Views**:
  - `vw_citizen_profile`

- **Description**: Enables citizens to view and update their personal profile information.

- **Contains**:
  - Display of current profile information, including full name, contact details, and address, as provided by `vw_citizen_profile`.
  - Edit form for updating profile information.

- **User Actions**:
  - **View Profile**: See current personal information.
  - **Edit Profile**: Update personal details as needed.

- **Purpose**: To maintain accurate and up-to-date personal information for effective communication and record-keeping.

---

### 3. File a Complaint

- **Routes**:
  - `GET /complaints/new`
  - `POST /complaints`

- **Views**:
  - `vw_citizen_barangays`

- **Description**: Allows citizens to file new complaints regarding issues in their barangay.

- **Contains**:
  - Complaint submission form requiring details like complaint type, description, and involved parties.
  - Option to select the barangay from a list provided by `vw_citizen_barangays`.
  - Ability to attach initial documents.

- **User Actions**:
  - **Fill Complaint Form**: Provide all necessary details about the complaint.
  - **Submit Complaint**: Officially file the complaint with the system.

- **Purpose**: To enable citizens to report issues formally, initiating the resolution process by the appropriate authorities.

---

### 4. Upload Complaint Documents

- **Routes**:
  - `GET /complaints/:complaint_id/documents/upload`
  - `POST /complaints/:complaint_id/documents`

- **Views**:
  - `vw_citizen_complaint_documents`

- **Description**: Allows citizens to upload and view supporting documents for their complaints.

- **Contains**:
  - Interface for selecting and uploading files (e.g., photos, videos, PDFs).
  - List of previously uploaded documents, accessible via `vw_citizen_complaint_documents`.

- **User Actions**:
  - **Select Files**: Choose files from their device to upload.
  - **Upload Documents**: Attach files to the specific complaint.
  - **View Documents**: Access uploaded documents associated with their complaints.

- **Purpose**: To provide additional evidence or information that supports the complaint, aiding in its resolution.

---

### 5. View Complaint Status

- **Routes**:
  - `GET /complaints`
  - `GET /complaints/:complaint_id`

- **Views**:
  - `vw_citizen_complaints`

- **Description**: Allows citizens to view a list of their complaints and check the status of each.

- **Contains**:
  - Summary list of all complaints filed by the citizen, as provided by `vw_citizen_complaints`.
  - Detailed view of individual complaints, including status updates.

- **User Actions**:
  - **View Complaint List**: See all submitted complaints at a glance.
  - **Check Status**: View current status (e.g., Pending, In Process, Resolved) of each complaint.
  - **View Details**: Access detailed information about a specific complaint.

- **Purpose**: To keep citizens informed about the progress and handling of their complaints.

---

### 6. View Complaint History

- **Routes**:
  - `GET /complaints/:complaint_id/history`

- **Views**:
  - `vw_citizen_complaint_history`

- **Description**: Provides a timeline of actions taken on the citizen's complaints.

- **Contains**:
  - Chronological list of all actions, updates, and notes added to the complaint, accessible via `vw_citizen_complaint_history`.
  - Details such as action date, description, and the lupon member responsible.

- **User Actions**:
  - **Review History**: Understand what actions have been taken and by whom.
  - **Stay Informed**: Keep track of the complaint's progress over time.

- **Purpose**: To ensure transparency and keep citizens updated on how their complaints are being addressed.

---

## **Lupon Member Features**

### 1. User Authentication

- **Routes**:
  - `POST /lupon/login`
  - `POST /lupon/logout`

- **Description**: Allows lupon members to securely access their accounts.

- **Contains**:
  - Login form for entering credentials (username and password).
  - Logout functionality.

- **User Actions**:
  - **Login**: Access the lupon dashboard and tools.
  - **Logout**: Securely exit the system after use.

- **Purpose**: To authenticate lupon members and grant them access to complaint management features.

---

### 2. View Assigned Complaints

- **Routes**:
  - `GET /lupon/complaints`
  - `GET /lupon/complaints/:complaint_id`

- **Views**:
  - `vw_lupon_complaints`

- **Description**: Allows lupon members to view complaints assigned to their barangay.

- **Contains**:
  - List of all complaints within their jurisdiction, provided by `vw_lupon_complaints`.
  - Filters for sorting by status, date filed, or complaint type.
  - Detailed view of individual complaints.

- **User Actions**:
  - **Browse Complaints**: See all complaints they are responsible for.
  - **View Details**: Access full information on a specific complaint.

- **Purpose**: To enable lupon members to manage and prioritize complaints effectively.

---

### 3. Update Complaint Status

- **Routes**:
  - `PUT /lupon/complaints/:complaint_id/status`

- **Description**: Allows lupon members to change the status of a complaint.

- **Contains**:
  - Interface for selecting new status (e.g., In Process, Resolved, Dismissed).
  - Option to add comments or notes explaining the status change.

- **User Actions**:
  - **Change Status**: Update the complaint's status to reflect its current state.
  - **Add Notes**: Provide context or details about the status update.

- **Purpose**: To keep the complaint's progress accurately reflected in the system for all stakeholders.

---

### 4. Add Complaint History Entry

- **Routes**:
  - `POST /lupon/complaints/:complaint_id/history`

- **Views**:
  - `vw_lupon_complaint_history`

- **Description**: Allows lupon members to document actions taken on a complaint.

- **Contains**:
  - Form for entering details about an action, including description and date.
  - Fields for specifying any next steps or required follow-ups.
  - Access to the complaint's history via `vw_lupon_complaint_history`.

- **User Actions**:
  - **Log Action**: Record any meetings, communications, or decisions made.
  - **Update History**: Keep the complaint's history comprehensive and up-to-date.

- **Purpose**: To maintain a complete record of all activities related to the complaint for accountability and reference.

---

### 5. Upload Complaint Documents

- **Routes**:
  - `GET /lupon/complaints/:complaint_id/documents/upload`
  - `POST /lupon/complaints/:complaint_id/documents`

- **Views**:
  - `vw_lupon_complaint_documents`

- **Description**: Allows lupon members to attach additional documents to a complaint.

- **Contains**:
  - Interface for uploading files such as official letters, notices, or evidence collected.
  - List of all documents associated with the complaint, accessible via `vw_lupon_complaint_documents`.

- **User Actions**:
  - **Select Files**: Choose documents to upload.
  - **Upload Documents**: Attach files to the complaint for record-keeping.
  - **View Documents**: Access documents associated with complaints.

- **Purpose**: To enrich the complaint record with official documents, aiding in resolution and future reference.

---

### 6. View Complaint Participants

- **Routes**:
  - `GET /lupon/complaints/:complaint_id/participants`

- **Views**:
  - `vw_lupon_complaint_participants`

- **Description**: Provides information about all individuals involved in a complaint.

- **Contains**:
  - List of participants with their roles (e.g., Complainant, Respondent), accessible via `vw_lupon_complaint_participants`.
  - Contact information and any relevant notes.

- **User Actions**:
  - **Review Participants**: Understand who is involved in the complaint.
  - **Access Contact Info**: Obtain necessary details to communicate with participants.

- **Purpose**: To ensure that all parties are identified and can be engaged appropriately during the resolution process.

---

## **Admin Features**

### 1. User Authentication

- **Routes**:
  - `POST /admin/login`
  - `POST /admin/logout`

- **Description**: Secures access to the administrative functions of the system.

- **Contains**:
  - Admin login form.
  - Logout functionality.

- **User Actions**:
  - **Login**: Access the admin dashboard and tools.
  - **Logout**: Securely exit the admin area.

- **Purpose**: To prevent unauthorized access to sensitive administrative features.

---

### 2. Manage Users

- **Routes**:
  - `GET /admin/users`
  - `GET /admin/users/:user_id`
  - `POST /admin/users`
  - `PUT /admin/users/:user_id`
  - `DELETE /admin/users/:user_id`

- **Views**:
  - `vw_admin_users`

- **Description**: Allows admins to oversee all user accounts in the system.

- **Contains**:
  - User list with search and filter capabilities, provided by `vw_admin_users`.
  - Detailed view of individual user profiles.
  - Forms for creating and editing users.
  - Options to assign roles and deactivate accounts.

- **User Actions**:
  - **View Users**: See all registered users.
  - **Add User**: Create new user accounts, including other admins and lupon members.
  - **Edit User**: Update user information and roles.
  - **Delete User**: Remove user accounts from the system.

- **Purpose**: To control access to the system and manage user permissions effectively.

---

### 3. Manage Lupon Members

- **Routes**:
  - `GET /admin/lupon_members`
  - `GET /admin/lupon_members/:lupon_id`
  - `POST /admin/lupon_members`
  - `PUT /admin/lupon_members/:lupon_id`
  - `DELETE /admin/lupon_members/:lupon_id`

- **Views**:
  - `vw_admin_lupon_members`

- **Description**: Allows admins to manage lupon members' records.

- **Contains**:
  - List of all lupon members, accessible via `vw_admin_lupon_members`.
  - Details such as name, position, contact info, and assigned barangay.
  - Forms for adding and editing lupon member information.

- **User Actions**:
  - **View Lupon Members**: See all lupon members in the system.
  - **Add Lupon Member**: Register new lupon members.
  - **Edit Lupon Member**: Update existing lupon member details.
  - **Delete Lupon Member**: Remove lupon members from the system.

- **Purpose**: To ensure the lupon member records are accurate and up-to-date for effective complaint handling.

---

### 4. Manage Locations (Barangays, Municipalities, Provinces)

- **Routes**:
  - `GET /admin/locations/barangays`
  - `POST /admin/locations/barangays`
  - `PUT /admin/locations/barangays/:id`
  - `DELETE /admin/locations/barangays/:id`
  - Similar routes for municipalities and provinces.

- **Views**:
  - `vw_admin_barangays`
  - `vw_admin_municipalities`
  - `vw_admin_provinces`

- **Description**: Allows admins to manage geographic entities within the system.

- **Contains**:
  - Lists of barangays (`vw_admin_barangays`), municipalities (`vw_admin_municipalities`), and provinces (`vw_admin_provinces`).
  - Forms for adding and editing location data.

- **User Actions**:
  - **View Locations**: See all geographic entries.
  - **Add Location**: Create new barangays, municipalities, or provinces.
  - **Edit Location**: Update names and associations.
  - **Delete Location**: Remove locations no longer in use.

- **Purpose**: To maintain an accurate geographic hierarchy for proper complaint assignment and management.

---

### 5. Manage Complaints

- **Routes**:
  - `GET /admin/complaints`
  - `GET /admin/complaints/:complaint_id`
  - `PUT /admin/complaints/:complaint_id`
  - `DELETE /admin/complaints/:complaint_id`

- **Views**:
  - `vw_admin_complaints`

- **Description**: Provides full access to all complaints in the system.

- **Contains**:
  - Comprehensive list of complaints with advanced search and filtering, via `vw_admin_complaints`.
  - Detailed view and edit options for individual complaints.

- **User Actions**:
  - **View All Complaints**: Monitor all complaints across barangays.
  - **Edit Complaint**: Update complaint details and statuses.
  - **Delete Complaint**: Remove complaints from the system if necessary.

- **Purpose**: To oversee the entire complaint process and intervene when needed to ensure efficiency and compliance.

---

### 6. Manage Roles and Permissions

- **Routes**:
  - `GET /admin/roles`
  - `POST /admin/roles`
  - `PUT /admin/roles/:role_id`
  - `DELETE /admin/roles/:role_id`

- **Views**:
  - `vw_admin_user_roles`

- **Description**: Allows admins to define and manage user roles and their associated permissions.

- **Contains**:
  - List of all roles, accessible via `vw_admin_user_roles`.
  - Forms for creating and editing roles.
  - Options to set permissions for each role.

- **User Actions**:
  - **View Roles**: See all roles defined in the system.
  - **Add Role**: Create new roles with specific permissions.
  - **Edit Role**: Modify permissions or role details.
  - **Delete Role**: Remove roles that are no longer needed.

- **Purpose**: To customize the access control within the system, ensuring users have appropriate permissions.

---

### 7. View Reports and Analytics

- **Routes**:
  - `GET /admin/reports`

- **Views**:
  - `vw_admin_complaint_statistics`

- **Description**: Provides insights into system usage and performance through reports.

- **Contains**:
  - Dashboards displaying statistics on complaints, users, and system activity, utilizing data from `vw_admin_complaint_statistics`.
  - Tools for generating custom reports.
  - Options to export data in various formats.

- **User Actions**:
  - **Generate Reports**: Create reports based on selected criteria.
  - **View Analytics**: Analyze trends and patterns in complaint data.
  - **Export Data**: Download reports for offline analysis or record-keeping.

- **Purpose**: To enable data-driven decision-making and identify areas for improvement within the system.

---

### 8. System Settings

- **Routes**:
  - `GET /admin/settings`
  - `PUT /admin/settings`

- **Description**: Allows admins to configure system-wide settings and preferences.

- **Contains**:
  - Options for setting default values, email configurations, and notification preferences.
  - Security settings, such as password policies and session timeouts.

- **User Actions**:
  - **Adjust Settings**: Modify system configurations to suit organizational needs.
  - **Update Preferences**: Set global preferences for how the system operates.

- **Purpose**: To customize the system's behavior and ensure it aligns with administrative policies and procedures.

---

# Summary

This revised guideline integrates the implemented views into the feature list for each user type, ensuring consistency between the system's documentation and its underlying architecture.

- **Citizens** can register, manage their profiles (supported by `vw_citizen_profile`), file complaints (selecting barangays via `vw_citizen_barangays`), upload and view documents (`vw_citizen_complaint_documents`), and track the status (`vw_citizen_complaints`) and history (`vw_citizen_complaint_history`) of their complaints.

- **Lupon Members** can log in, view and manage complaints in their barangay (`vw_lupon_complaints`), update statuses, document actions (`vw_lupon_complaint_history`), manage documents (`vw_lupon_complaint_documents`), and view participants involved in complaints (`vw_lupon_complaint_participants`).

- **Admins** have comprehensive control over the system, including user management (`vw_admin_users`), lupon member oversight (`vw_admin_lupon_members`), location data management (`vw_admin_barangays`, `vw_admin_municipalities`, `vw_admin_provinces`), complaint administration (`vw_admin_complaints`), role and permission settings (`vw_admin_user_roles`), access to reports (`vw_admin_complaint_statistics`), and system configurations.

Each feature is designed to facilitate transparent, efficient, and effective complaint management, ensuring that issues are addressed promptly and fairly.
