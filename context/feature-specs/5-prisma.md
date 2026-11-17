Prisma is already installed so, add project data models, prisma client singleton, and first migration.


## Model

Create 'prisma/models/project.prisma'.

Add 'Project':

- owner ID mapped to Clerk user
- name
- optional description
- status enum 'DRAFT', 'ARCHIVED'
- 'canvasJsonPath' for future canvas blob storage
- timestamps
- indexes on owner ID and creation date


Add 'ProjectCollaborator':

- project relation with cascade delete
- collaborator email
- timestamp
- unique constraint on project/email
- indexes on gmail and project/date

Do not add extra fields unless required by prisma.

## Prisma Client

create 'lib/prisma.ts' as a cache singleton:

Branch by 'DATABASE_URL':

- If it starts with 'prisma+postgres://', use accelerate
- otherwise use direct '@prisma/adapter-pg'

Cache the client on 'global' in development for hot reload.


## Migration
 

Run the migration and generate the client.


### Dependencies

Already installed:

- 'prisma'
- '@prisma/client'
- '@prisma/adapter-pg'
- 'pg'

### Check

- Schema has both models with correct relationship and indexes
- 'lib/prisma.ts' export one cached Prisma instance
- migration runs successfully
- 'npm run build' passed 