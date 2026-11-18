Add 'Share' button to editor navbar that open up the share dialog.

Owner can: 

- invite collaborators via email.
- view current collaborators.
- remove collaborators.
- copy project link with temporary 'Copied!' feedback.

Collaborator can: 

- view the list of current collaborators
- Can't remove, invite or manage access.

### Clerk user data

Collaborators are stored by email in the database.

Use Clerk backend API to enrich collaborators email with:

- display name 
- avatar image

if Clerk user is not found, fall back to showing only email.

### Implementation

Add the required API logic for: 

- listing the current collaborators
- inviting collaborators
- removing collaborators

Enforce ownership server-side for invite and remove action.

Do not add local user table.

### Check when done:

- Share dialog open from the workspace
- Owner can invite and remove collaborators
- Collaborators can only see read-only access.
- Collaborators avatar/name loaded from Clerk when available.
- 'npm run build' passes

