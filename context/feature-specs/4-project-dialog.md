Build the '/editor' homescreen and add project/sidebar action. No api calls or persistence yet.

## Editor Home

Reuse the existing editor layout. Do not modify the navbar or sidebar behavior.

In the center of the page, add:

- Heading: 'Create a project or open an existing one'
- Description: 'Start new architecture workspace, or choose a project from the sidebar'.
- 'New Project' button with a 'Plus' Icon.

Keep the layout minimal, Do not wrap this content in cards.

Clicking 'New Project' should open Create Project Dialog.

## Dialogs 

###  Create Project

- project name input
- live slug preview based on the name
- preview updates as the user types

## Rename Project

- prefilled project name input
- current project name shown in the description
- input auto-focuses
- Enter submits

## Delete Projects

- Destructive confirmation only
- no input
- confirm button use destructive styling
 
## Sidebar

Add project item actions:

- rename 
- delete

Show actions only for owned projects.

Hide actions for shared/collaborator projects.

On mobile:

- tapping outside the sidebar closed it.
- add a backdrop scrim

### Implementation

Create a dedicated hook to manage: 

- Dialog state
- Form state
- loading state

wire: 

- editor home 'New Project' -> Create Dialog
- sidebar create -> Create Dialog
- sidebar rename -> Rename Dialog
- sidebar delete -> Delete Dialog

use mock project data only. Do not add api calls or persistence.

## Check When done:

- sidebar actions are wired
- slug preview works
- no TypeScript errors
- no lint errors