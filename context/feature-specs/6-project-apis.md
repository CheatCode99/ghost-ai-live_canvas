The database schema is ready, now we build Backend API only.

## Routes

- 'GET /api/projects', list the current user's project.
- 'POST /api/projects', create project.
- 'PATCH /api/projects/[projectId]', rename project.
- 'DELETE /api/projects/[projectId]', Delete project.


## Rules

Use Authenticated Clerk user Id as 'ownerId'

When creating: 

- Default missing project name to 'Untitled Project'
- Use the schema's existing ID strategy, Don't add new sequential IDs

Security:

- unauthenticated requests return '401'
- only project owner can rename or delete
- non owner mutations returns '403' 


Keep this as backend only and don't wired to UI yet.


### Checks

- routes exists for list/create/rename/delete
- owner checks are enforced for rename and delete
- '401' and '403' responses are handled correctly.
- 'npm run build' passes