setup real time collaboration infrastructure using liveblocks.

### Configuration

Configure the 'liveblocks.config.ts' at the project root.

Define:

## Presence

- cursor positioning
- 'isThinking' boolean

### UserMeta

- user ID
- display name
- avatar url
- cursor url

### Liveblock client

Create a cached Liveblocks node client in 'libs'.

 Add a helper that deterministically maps a user ID to a consistent color from a fixed color pallete.

 ### Auth route

 Create 'POST /api/liveblocks-auth'.

 Use the project ID as Liveblocks room ID.

 This route must:

 1. require Clerk's authentication
 2. verify project access using the existing access helper.
 3. ensure liveblock existed (create only if needed)
 4. return a session token with:
    - user name
    - avatar 
    - generated cursor color

Return '403' for unauthorized project.

