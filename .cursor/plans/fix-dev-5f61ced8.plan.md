<!-- 5f61ced8-ae09-476d-9371-ab573c75e4c5 571786d0-7a73-4bb4-81ba-a1ce82ce18d0 -->
# MVP Implementation Plan

## Overview

Build a complete MVP agile tracker with seamless GitHub integration, focusing on developer experience and workflow automation. The architecture will support easy GitLab integration in the future.

## Database Schema Updates

Extend Prisma schema to support:

- **Projects**: Core organizational unit, linked to Git repositories
- **Issues**: Tasks/tickets with full metadata (title, description, status, assignee, labels, story points)
- **Milestones**: Sprint/release grouping for issues
- **Comments**: Discussion threads on issues
- **GitHubRepositories**: Store connected repo metadata
- **Branches/PullRequests**: Track Git entities linked to issues

Key files: `server/prisma/schema.prisma`

## Backend API Development

### Project Management Module

- CRUD operations for projects
- Link projects to GitHub repositories (store repo owner/name)
- List user's accessible GitHub repos via GitHub API

### Issue Management Module

- Full CRUD for issues with rich metadata
- Support for issue status transitions (To Do → In Progress → Done)
- Assignee management, labels, story points
- Parent-child relationships for subtasks
- Comment system with real-time updates
- **Issue Templates**: 
- Base templates (Bug Report, Feature Request, Task, User Story)
- Custom user-created templates with predefined fields
- Template selection when creating new issues
- Template management (create, edit, delete custom templates)

### Milestone Module

- Create/manage milestones
- Associate issues with milestones
- Progress tracking (completed vs total issues)

### GitHub Integration Module

- **OAuth**: Already implemented ✓
- **Webhook Handler**: Receive GitHub events (push, pull_request, branch creation)
- **Auto-linking**: Parse branch names, PR titles, commit messages for issue IDs (e.g., `DEV-123`)
- **Status Automation**: 
- Branch created → Move issue to "In Progress"
- PR opened → Move to "In Review"
- PR merged → Move to "Done"
- **API Service**: Fetch PR status, CI/CD checks, review status from GitHub REST API
- Store GitHub access tokens securely per user

Key files: `server/src/projects/`, `server/src/issues/`, `server/src/milestones/`, `server/src/github/`

## Frontend Development

### UI Framework Setup

- Install Material-UI (MUI) and configure theming
- Set up React Router for navigation
- Implement persistent sidebar navigation

### Core Pages/Components

**Dashboard Page**

- Project list/grid view
- Quick stats (open issues, active PRs)
- Recent activity feed

**Project Detail Page**

- Kanban board with drag-and-drop (react-beautiful-dnd or @dnd-kit)
- Columns: To Do, In Progress, In Review, Done
- Issue cards showing title, assignee, labels, linked PR status

**Issue Detail Modal/Page**

- Full issue view with all metadata
- **Git Information Block** (prominent section):
- Linked branches with repo links
- Linked PRs with status badges (Open/Merged/Closed)
- PR review status (Approved/Changes Requested)
- CI/CD check status (Passing/Failing) with visual indicators
- Comment thread
- Edit capabilities

**Milestone View**

- List of milestones with progress bars
- Issues grouped by milestone

**Settings Page**

- Connect/disconnect GitHub repositories
- Webhook setup instructions

Key files: `client/src/pages/`, `client/src/components/`

## Real-Time Features

- Integrate Socket.IO for live updates
- Broadcast issue status changes to all connected clients
- Real-time comment updates
- Live PR status updates when webhooks fire

Key files: `server/src/main.ts`, `client/src/services/socket.ts`

## Architecture for Future GitLab Support

- Abstract Git provider interface (`IGitProvider`)
- Separate `GitHubService` and future `GitLabService` implementing the interface
- Store provider type in repository model (`provider: 'github' | 'gitlab'`)
- Webhook handlers route to appropriate service based on provider

## Testing & Documentation

- Write unit tests for critical backend services (GitHub auto-linking logic, status automation)
- Update README with:
- GitHub webhook setup instructions
- Issue ID format conventions
- Branch naming conventions for auto-linking

## Deployment Preparation

- Environment variables documentation
- Database migration strategy
- Docker compose setup for local development

### To-dos

- [ ] Create .env.example file with all required environment variables and update README with setup instructions
- [ ] Install Prisma, create schema with User model, and set up database connection
- [ ] Update GitHub strategy and session serializer to persist users in database
- [ ] Fix all 13 ESLint errors with proper TypeScript types across auth module files
- [ ] Fix failing auth.controller.spec.ts test by properly mocking ConfigService
- [ ] Implement logout endpoint and add logout button to client UI
- [ ] Run all tests and linters to verify everything is working correctly