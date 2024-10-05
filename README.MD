Every table here plays a specific role, and they all link together in practical ways to make complaint management as smooth as possible. **Citizens** file complaints, **lupon members** work on them, and **admins** keep everything organized. The `complaints` table is central, but it’s everything around it—the documents, the history, the participants—that paints the full picture for resolving issues efficiently.

### 1. Table Descriptions and Purposes

| Table Name               | Description                                                                                           | Purpose                                                                                               |
|--------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **barangays**            | Holds data about each barangay.                                                                      | Tracks barangay names, their municipality, and province. This links to complaints and lupon members.  |
| **citizens**             | Stores basic citizen info like email and phone.                                                      | Acts as the citizen identity in the system. Every citizen starts here—the baseline data for complaints.|
| **citizen_profiles**     | More detailed citizen info like full name and address.                                               | Extends the base info in `citizens` with specific details like house number and street.               |
| **lupon_members**        | Details about members of the Lupon Tagapamayapa.                                                     | Lists who’s part of the lupon for each barangay, including their contact info and role.             |
| **complaints**           | Central table for all complaints filed by citizens.                                                  | Stores complaint details, like case number, type, description, and current status.                    |
| **complaint_documents**  | Holds documents related to complaints.                                                               | Links relevant files—think evidence, supporting docs—to the complaints.                          |
| **complaint_history**    | Tracks every action taken on a complaint.                                                            | Maintains an audit trail: who did what and when, for a complete picture of the complaint's progress.  |
| **people**               | Stores info about individuals tied to complaints.                                                    | Handles participants who aren't registered citizens but are still involved, like respondents.         |
| **complaint_participants** | Associates people with complaints, specifying their role (e.g., complainant, respondent).          | Tracks each person’s role within a complaint—who’s the complainant, who’s the respondent, etc.      |
| **user_roles**           | Stores different roles, like admin or lupon_member.                                                  | Controls permissions across the system. Defines what each role can access or modify.                 |
| **users**                | General user data, including role assignments.                                                       | Manages system users. Links each person to their corresponding role, giving them appropriate permissions. |

### 2. User Stories

To give you a sense of how these tables work together, here are some user stories that show real interactions:

#### **User Story 1: Citizen Files a Complaint**
**As a citizen, I want to file a complaint with my barangay so that I can address a neighborhood issue.**

- A citizen signs up and logs in to the system. Their basic details are stored in the `citizens` table, while more detailed info (like their address) is saved in `citizen_profiles`.
- They then navigate to the "File a Complaint" section. Here, they enter their complaint details—say, an issue with noise from a neighbor.
- This information is saved to the `complaints` table and associated with their barangay. If they need to add evidence, like photos or other documents, those files go into `complaint_documents`, linked by the `complaint_id`.

#### **User Story 2: Citizen Tracks Complaint Status**
**As a citizen, I want to track my complaint so I know what's happening.**

- The citizen logs back in after a few days to check the status of their complaint.
- They visit "My Complaints," where they see the current status—maybe still "Pending" or now "Resolved." This status is tracked in the `complaints` table.
- Any updates made by lupon members are logged in `complaint_history`. This way, the citizen knows exactly when updates or actions were taken and by whom.

#### **User Story 3: Lupon Member Updates Complaint**
**As a lupon member, I want to update the complaint status so the citizen knows we’re working on it.**

- A lupon member logs in and accesses the complaints linked to their barangay.
- They select a complaint, maybe one involving a dispute between two households, and change the status from "Pending" to "In Process." They can also add notes, which get logged in `complaint_history`.
- This ensures both transparency and accountability, as citizens can see the history of actions related to their complaint.

#### **User Story 4: Admin Adds a Lupon Member**
**As an admin, I want to add new lupon members so that we can handle more complaints.**

- An admin logs in and navigates to the lupon management section.
- They add a new lupon member, filling in the name, position, and the assigned barangay. This information goes into `lupon_members`.
- Now, the new lupon member can start managing complaints for their barangay.

#### **User Story 5: Citizen Adds More Documents**
**As a citizen, I want to add more documents to my complaint so that the officials have more context.**

- A citizen logs in, selects their existing complaint, and uploads an additional document—maybe a screenshot or another piece of evidence.
- This new document gets added to the `complaint_documents` table, linked to the specific complaint.
- Lupon members handling that complaint can immediately see the new document when they log in.

#### **User Story 6: Lupon Member Views Participants**
**As a lupon member, I want to see everyone involved in a complaint so I can ensure the right people are notified.**

- The lupon member views a complaint they are handling. They can see the full list of participants linked to it in `complaint_participants`.
- The system pulls data from `people` and `citizens` to show more details on each participant—like whether they're a complainant or a respondent, and their contact details.
