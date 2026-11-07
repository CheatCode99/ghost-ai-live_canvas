Clerk is already installed and connected. Wired it into Next.js app: provider, auth pages, redirects, route protection, and user menu.

###Design 

Use Clerk's 'dark' theme from '@clerk/ui/themes' as the base.

Overide Clerk's appearance variables using the app's existing CSS variables, But Do not hard code colors.

###Sign Up & Sign In pages:

- Large screens: simple two-panel layout
- left: compact logo, tagline, short text-only feature list
- right: centered Clerk Form
- small screen: Form only
- no gradient
- no oversized hero section
- no feature card
- no scroll-heavy layouts 

keep the layout minimal and professional.

## Implementation 

Wrap the root layout with 'ClerkProvider' using Clerk's 'dark' theme

Create Sign-in and sign-up pages using Clerk's components.

Use 'proxy.ts'  at the project's root, not 'middleware.ts'

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

update '/' :

- authenticated users redirect to '/editor'
- unauthenticated users redirect to '/sign-in'


Add Clerk's built-in 'UserButton' to the editor navbar right section for profile settings and logout.

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals. 

Use existing Clerk env vars. Do not rename or invent new one. 


##Dependencies

Install : @clerk/ui 

## Check when done: 


- 'proxy.ts' exists at the root
- all routes are protected except public auth path
- auth pages use CSS variables with no hard-coded colors
- 'ClerkProvider' wraps the root Layout
- 'npm run build' passes
