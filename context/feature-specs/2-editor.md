I need base chrome components that frame every editor screen- the top navbar and side bar shell to the left. These will be reuse and extend later on.

### Editor Navbar

Create 'components/editor/editor-navbar.tsx' 

Requirements:

- fixed-height top navbar 
- left, center, right sections
- left sections contains sidebar toggle button
- use 'PanelLeftOpen' / 'PanelLeftClose' icons based on sidebar state
- right section stay empty for now
- dark background with subtle bottom border.



### Project Sidebar
Create 'components/editor/project-sidebar.tsx'

Requirements:

- sidebar that float above the editor canvas
- opening it should not push page content
- slides in from the left
- accept 'isOpen' prop
- header with 'Projects' title + close button
- shadcn 'Tabs':
    - My Project
    - Shared
- Both tabs show empty placeholder state:
- Full-width 'New Project' button at the bottom with 'Plus' icon


##Dialog Pattern 

Use the existing color tokens from 'globals.css' for dialog styling

Support:

- title
- description
- footer actions

Do not build the dialog yet.


## Check When done.

- new components compile without TypeScript errors 
- no lint errors
- Dialog pattern ready for future use.