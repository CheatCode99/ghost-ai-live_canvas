Wire the editor home sidebar and dialog to real project API. 


### Data Fetching 

The editor homepage is a server component.

Fetch owned and shared projects server-side using the existing project data helper and pass both lists to sidebar.


No client-side fetching for the initial load.

### 'Use Project Actions'

Use a hook in '/hooks' that manages dialog state and project mutation state.


**Create**

- manages create dialog state
- manages project name input
- generate a short unique suffix
- slugify the name to create the room ID
- Call "POST /api/projects"
- navigate to the new workspace 

The project id and LiveBlock room id should stay aligned.


**Rename**

- store target project id and current name
- call 'PATCH /api/projects/[id]'
- refresh on success

**Delete**

- store target project
- call 'DELETE /api/projects/[id]'
- redirect to '/editor' if delete the active workspace.
- otherwise refresh 


### Wiring

connect the hook to sidebar and dialog.

- create dialog show current room id preview
- rename dialog pre-load with current project name
- delete dialog show project name 

## Check 

- sidebar uses real project data 
- create navigate to workspace 
- rename updates correctly
- delete refreshes or redirect correctly
- 'npm run build' passes