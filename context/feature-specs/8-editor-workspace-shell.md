Build 'editor/[roomId]' workspace shell with server-side access check. No canvas logic yet.


## Access 

'editor/[roomId]' must be a server component.

before rendering:

- Unauthenticated user will be redirect to '/sign-in'
- User with no project access see 'AccessDenied'
- Non-existence project will show 'AccessDenied'

create 'components/editor/access-denied.tsx' with:

- Lock icon
- Centered layout
- short message
- link back to '/editor' 

### Access helper

create 'lib/project-access.tsx' with helper for: 

- getting the current Clerk's identity: 'userId' + primary email
- checking project by owner or collaborator

### Layout

Build full-viewport workspace with:


- top navbar showing the project name
- navbar actions : share button and AI sidebar toggle
- existing 'ProjectSidebar' on the left
- current room hightlight in the sidebar
- central canvas placeholder with dark background and centered message
- right side bar for future Ai Chat

Canvas area should fill the remaining space.


## Scope

Do not add canvas logic, Liveblocks, AI Chat or sharing behavior yet.

## Check when done

- '/editor/[roomId]' build successfully
- access helper exist outside of the page component
- 'AccessDenied' is used for Missing or unauthorized projects.
- workspace layout renders with current project context
- No TypeScript errors
