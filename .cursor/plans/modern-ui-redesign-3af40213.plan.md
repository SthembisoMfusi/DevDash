<!-- 3af40213-457e-4fe1-921e-bc076f68fb49 914c82c2-3b0a-457c-83ae-13519068563c -->
# Complete MVP Implementation with Authentication Overhaul

## Overview

Redesign authentication system to use independent user accounts with optional GitHub/GitLab linking. Users must register first, then link providers to access Git features. Complete all MVP features including auto-sync, Kanban board, Issue Detail with Git Information Block, Milestones, and multi-user collaboration.

## Phase 0: Authentication Overhaul (PRIORITY)

### Complete User Registration & Authentication System

Separate user accounts from Git provider authentication. Users register with email/password, then optionally link GitHub and/or GitLab. At least one provider must be linked to create projects.

### Backend: Auth System Redesign

**Update Prisma Schema with Indexes:**

```prisma
model User {
  id                Int       @id @default(autoincrement())
  email             String    @unique
  password          String    // Hashed with bcrypt
  username          String    @unique
  name              String?
  avatarUrl         String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Git Provider Links (optional)
  githubId          Int?      @unique
  githubUsername    String?
  githubAccessToken String?
  githubLinkedAt    DateTime?
  
  gitlabId          Int?      @unique
  gitlabUsername    String?
  gitlabAccessToken String?
  gitlabLinkedAt    DateTime?
  
  lastSyncedAt      DateTime?
  
  // Relations remain the same
  projects          Project[]
  assignedIssues    Issue[]   @relation("IssueAssignee")
  createdIssues     Issue[]   @relation("IssueCreator")
  comments          Comment[]
  issueTemplates    IssueTemplate[]
  projectMemberships ProjectMember[]
  
  @@index([email])
  @@index([username])
  @@index([githubId])
  @@index([gitlabId])
  @@index([createdAt])
  @@map("users")
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // External sync fields
  externalId  String?
  source      RepositorySource?
  
  // Relations
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  repositories GitHubRepository[]
  issues      Issue[]
  milestones  Milestone[]
  templates   IssueTemplate[]
  members     ProjectMember[]
  
  @@index([ownerId])
  @@index([name])
  @@index([source])
  @@index([externalId])
  @@index([createdAt])
  @@index([ownerId, createdAt])
  @@map("projects")
}

model Issue {
  id          Int         @id @default(autoincrement())
  title       String
  description String?
  status      IssueStatus @default(TODO)
  priority    Priority    @default(MEDIUM)
  storyPoints Int?
  labels      String[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  projectId   Int
  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  creatorId   Int
  creator     User        @relation("IssueCreator", fields: [creatorId], references: [id])
  assigneeId  Int?
  assignee    User?       @relation("IssueAssignee", fields: [assigneeId], references: [id])
  milestoneId Int?
  milestone   Milestone?  @relation(fields: [milestoneId], references: [id])
  parentId    Int?
  parent      Issue?      @relation("IssueHierarchy", fields: [parentId], references: [id])
  subtasks    Issue[]     @relation("IssueHierarchy")
  comments    Comment[]
  branches    Branch[]
  pullRequests PullRequest[]
  
  @@index([projectId])
  @@index([status])
  @@index([priority])
  @@index([assigneeId])
  @@index([creatorId])
  @@index([milestoneId])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([projectId, status])
  @@index([projectId, assigneeId])
  @@index([projectId, createdAt])
  @@index([title]) // For text search
  @@map("issues")
}

model Milestone {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  projectId   Int
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  issues      Issue[]
  
  @@index([projectId])
  @@index([dueDate])
  @@index([createdAt])
  @@index([projectId, dueDate])
  @@map("milestones")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  issueId   Int
  issue     Issue    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  
  @@index([issueId])
  @@index([authorId])
  @@index([createdAt])
  @@index([issueId, createdAt])
  @@map("comments")
}

model ProjectMember {
  id        Int         @id @default(autoincrement())
  projectId Int
  userId    Int
  role      ProjectRole @default(MEMBER)
  createdAt DateTime    @default(now())
  
  project   Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
  @@index([role])
  @@map("project_members")
}

enum RepositorySource {
  GITHUB
  GITLAB
  MANUAL
}

enum ProjectRole {
  OWNER
  ADMIN
  MEMBER
}
```

**New Auth Files:**

- `server/src/auth/dto/register.dto.ts` - Registration DTO
- `server/src/auth/dto/login.dto.ts` - Login DTO
- `server/src/auth/local.strategy.ts` - Passport local strategy
- `server/src/auth/jwt.strategy.ts` - JWT validation
- `server/src/auth/guards/jwt-auth.guard.ts` - JWT guard
- `server/src/auth/guards/provider-linked.guard.ts` - Require provider

**Auth Endpoints:**

```
POST   /auth/register              - Create account
POST   /auth/login                 - Login (returns JWT)
POST   /auth/logout                - Logout
GET    /auth/me                    - Get current user

GET    /auth/github/link           - Link GitHub (OAuth)
GET    /auth/github/callback       - GitHub callback
POST   /auth/github/unlink         - Unlink GitHub

GET    /auth/gitlab/link           - Link GitLab (OAuth)
GET    /auth/gitlab/callback       - GitLab callback
POST   /auth/gitlab/unlink         - Unlink GitLab
```

**Dependencies to Install:**

```bash
npm install bcrypt @nestjs/jwt @nestjs/passport passport-jwt passport-local
npm install -D @types/bcrypt @types/passport-jwt @types/passport-local
```

**Implementation:**

1. Hash passwords with bcrypt (10 rounds)
2. JWT tokens (expires: 7 days)
3. Update GitHub/GitLab strategies to **link** accounts, not create users
4. Provider linking guard: require at least one linked provider for project creation
5. Store JWT in httpOnly cookie

### Frontend: Complete Auth UI

**New Pages:**

- `client/src/pages/Register.jsx` - Registration
- `client/src/pages/Login.jsx` - Login (email/password)
- `client/src/pages/Profile.jsx` - User profile

**Register Page:**

- Email (validated)
- Username (unique, 3-20 chars)
- Password (min 8 chars, strength indicator)
- Full name
- "Already have account?" → Login

**Login Page:**

- Email or username
- Password
- "Remember me"
- "Forgot password?"
- "Create account" → Register

**Profile/Settings (Enhanced):**

- Account: Edit name, email, password
- **GitHub Section:**
  - Status badge (Linked/Not Linked)
  - Link/Unlink button
  - Last synced timestamp
- **GitLab Section:**
  - Status badge (Linked/Not Linked)
  - Link/Unlink button
  - Last synced timestamp
- Warning: "Link at least one provider to create projects"

**App.jsx Updates:**

- Check JWT on mount
- Redirect to /login if no auth
- Show banner if no providers linked

### ProviderLinkedGuard

```typescript
// Protect project creation endpoints
@Post()
@UseGuards(JwtAuthGuard, ProviderLinkedGuard)
createProject() { ... }
```

## Phase 1: Auto-Sync GitHub/GitLab Projects

### Backend: Sync Service

**New Files:**

- `server/src/sync/sync.service.ts`
- `server/src/sync/sync.module.ts`
- `server/src/sync/sync.controller.ts`

**Features:**

- Fetch repos from GitHub/GitLab after linking
- Compare with DB projects
- Auto-create/update projects (detect changes)
- Store last sync per provider
- Incremental sync (only modified repos)
- Manual sync endpoint: `POST /sync/projects`

**Update Project Schema:**

```prisma
model Project {
  // ... existing
  externalId   String?  // GitHub/GitLab repo ID
  source       RepositorySource?  // GITHUB, GITLAB, MANUAL
}

enum RepositorySource {
  GITHUB
  GITLAB
  MANUAL
}
```

### Frontend: Sync UI

- Sync status indicator in Dashboard
- Toast on sync completion
- Last synced display in Settings
- "Sync Now" button

## Phase 2: GitLab Integration

### Backend: GitLab Service

**Files:**

- `server/src/gitlab/gitlab.service.ts`
- `server/src/gitlab/gitlab.module.ts`
- `server/src/gitlab/gitlab.controller.ts`
- `server/src/auth/gitlab.strategy.ts`

**Features:**

- GitLab OAuth (link to existing user)
- Fetch GitLab projects
- Sync MRs, branches
- Webhooks
- CI/CD pipeline status

**Endpoints:**

```
GET    /gitlab/projects
GET    /gitlab/projects/:id/merge-requests
POST   /gitlab/webhook
```

**Environment:**

```env
GITLAB_CLIENT_ID=
GITLAB_CLIENT_SECRET=
GITLAB_CALLBACK_URL=http://localhost:3000/auth/gitlab/callback
```

### Frontend: GitLab Support

- "Link GitLab" in Profile
- GitLab badge in Settings
- Show both GitHub & GitLab repos

## Phase 3: Kanban Board

### Components:

- `KanbanBoard.jsx` - Main board
- `KanbanColumn.jsx` - Column (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- `IssueCard.jsx` - Draggable card
- `CreateIssueModal.jsx` - Quick create

**Features:**

- Drag-and-drop (@dnd-kit)
- Auto-save status on drop
- Filters: assignee, label, priority
- Search issues
- Quick actions

**Backend:**

- `PATCH /issues/:id/status`
- Real-time with Socket.IO

**Install:**

```bash
npm install socket.io @nestjs/websockets @nestjs/platform-socket.io
```

## Phase 4: Issue Detail Page

### Components:

- `GitBlock.jsx` - Git info display
- `StatusBadge.jsx` - Status pill
- `PriorityIndicator.jsx` - Priority visual
- `CommentSection.jsx` - Comments (markdown)
- `IssueMetadata.jsx` - Assignee, labels, milestone

**Git Block Shows:**

- Linked branches
- Commits with avatars
- PR/MR cards: state, review status, CI/CD status
- Links to GitHub/GitLab

**Backend:**

```
GET /issues/:id/branches
GET /issues/:id/commits
GET /issues/:id/pull-requests
POST /issues/:id/comments
```

**Install:**

```bash
cd client
npm install react-markdown date-fns
```

## Phase 5: Milestones Page

**Components:**

- Milestone list with progress bars
- Create/Edit modal
- Milestone detail view

**Features:**

- Progress percentage
- Due date countdown
- Issue breakdown by status
- Assign issues to milestones

**Backend:**

```
GET /milestones/:id/progress
```

## Phase 6: Multi-User Collaboration

### Schema:

```prisma
model ProjectMember {
  id        Int         @id @default(autoincrement())
  projectId Int
  userId    Int
  role      ProjectRole @default(MEMBER)
  createdAt DateTime    @default(now())
  
  project   Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
  @@map("project_members")
}

enum ProjectRole {
  OWNER
  ADMIN
  MEMBER
}
```

**Features:**

- Invite collaborators
- Auto-add repo contributors
- Role-based permissions:
  - OWNER: Full control
  - ADMIN: Manage members
  - MEMBER: Create/edit issues
- Members list in project

**Endpoints:**

```
POST   /projects/:id/members
DELETE /projects/:id/members/:userId
GET    /projects/:id/members
POST   /projects/:id/sync-contributors
```

**Frontend:**

- Team section in ProjectDetail
- Member avatars
- Invite dialog
- Sync contributors button

## Phase 7: Remaining Components

### StatusBadge

Color-coded: TODO (gray), IN_PROGRESS (blue), IN_REVIEW (yellow), DONE (green)

### PriorityIndicator

LOW (green), MEDIUM (yellow), HIGH (orange), URGENT (red)

### UserAvatar

Tooltip with name/email, consistent sizing

## Phase 8: Polish

- Animations: hover, drag, toast
- Responsive: mobile Kanban, responsive grid
- Error handling: network errors, retry logic
- Loading skeletons
- Performance optimization

## Implementation Order

**Week 1:** Auth overhaul + migration

**Week 2:** Auto-sync + GitLab integration

**Week 3:** Kanban board

**Week 4:** Issue Detail + Git Block

**Week 5:** Milestones + Collaboration

**Week 6:** Polish + Testing

## Migration for Existing Users

1. Run Prisma migration
2. Backfill: convert GitHub-only users to email/password users
3. Set temporary passwords
4. Send password reset emails
5. No data loss

## Security

- Bcrypt password hashing (10 rounds)
- JWT in httpOnly cookies
- CSRF tokens on webhooks
- Rate limiting on auth endpoints
- Encrypted access tokens in DB
- Permission checks on all endpoints

## Success Criteria

- ✅ Registration/Login with email/password
- ✅ Link/unlink GitHub & GitLab
- ✅ Require provider for project creation
- ✅ Auto-sync on provider link
- ✅ Full GitLab integration
- ✅ Functional Kanban with drag-and-drop
- ✅ Complete Issue Detail + Git Block
- ✅ Milestones with progress
- ✅ Multi-user with roles
- ✅ Responsive design
- ✅ Error handling

### To-dos

- [ ] Install lucide-react icon library
- [ ] Create comprehensive dark-mode-first theme in App.jsx with new color palette
- [ ] Update index.css with dark-mode-first global styles and remove old light theme
- [ ] Completely redesign Layout component with dark theme, new icons, and modern navigation
- [ ] Create StatusBadge, PriorityIndicator, EmptyState, and UserAvatar components
- [ ] Redesign Dashboard page with new theme, Lucide icons, and modern card styling
- [ ] Redesign LoginPage with dark theme, gradient background, and glassmorphism effects
- [ ] Build complete Settings page with GitHub repo management and user preferences
- [ ] Create KanbanBoard and IssueCard components for project detail page
- [ ] Complete ProjectDetail page with functional Kanban board and drag-and-drop
- [ ] Create GitBlock component to display branches, PRs, commits, and CI/CD status
- [ ] Complete IssueDetail page with Git Information Block, comments, and metadata
- [ ] Complete Milestones page with progress tracking and milestone management
- [ ] Add micro-interactions, hover effects, and smooth transitions across all components
- [ ] Review all pages for consistency, test responsive design, and optimize performance