import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueDto, UpdateIssueDto, CreateCommentDto, IssueStatus } from './dto';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async create(createIssueDto: CreateIssueDto, userId: number) {
    // Verify project exists and user has access
    const project = await (this.prisma as any).project.findUnique({
      where: { id: createIssueDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return (this.prisma as any).issue.create({
      data: {
        ...createIssueDto,
        creatorId: userId,
      },
      include: {
        creator: true,
        assignee: true,
        project: true,
        milestone: true,
        parent: true,
        subtasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        branches: true,
        pullRequests: true,
      },
    });
  }

  async findAll(projectId: number, userId: number) {
    // Verify project access
    const project = await (this.prisma as any).project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return (this.prisma as any).issue.findMany({
      where: {
        projectId,
      },
      include: {
        creator: true,
        assignee: true,
        project: true,
        milestone: true,
        parent: true,
        subtasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        branches: true,
        pullRequests: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const issue = await (this.prisma as any).issue.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
        project: {
          include: {
            owner: true,
          },
        },
        milestone: true,
        parent: true,
        subtasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        branches: {
          include: {
            repository: true,
          },
        },
        pullRequests: {
          include: {
            repository: true,
          },
        },
      },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    if (issue.project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this issue');
    }

    return issue;
  }

  async update(id: number, updateIssueDto: UpdateIssueDto, userId: number) {
    const issue = await this.findOne(id, userId);
    
    return (this.prisma as any).issue.update({
      where: { id },
      data: updateIssueDto,
      include: {
        creator: true,
        assignee: true,
        project: true,
        milestone: true,
        parent: true,
        subtasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        branches: true,
        pullRequests: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const issue = await this.findOne(id, userId);
    
    return (this.prisma as any).issue.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: IssueStatus, userId: number) {
    const issue = await this.findOne(id, userId);
    
    return (this.prisma as any).issue.update({
      where: { id },
      data: { status },
      include: {
        creator: true,
        assignee: true,
        project: true,
        milestone: true,
        parent: true,
        subtasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        branches: true,
        pullRequests: true,
      },
    });
  }

  async addComment(createCommentDto: CreateCommentDto, userId: number) {
    // Verify issue exists and user has access
    const issue = await this.findOne(createCommentDto.issueId, userId);
    
    return (this.prisma as any).comment.create({
      data: {
        ...createCommentDto,
        authorId: userId,
      },
      include: {
        author: true,
        issue: true,
      },
    });
  }

  async getComments(issueId: number, userId: number) {
    // Verify issue access
    await this.findOne(issueId, userId);
    
    return (this.prisma as any).comment.findMany({
      where: {
        issueId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getSubtasks(issueId: number, userId: number) {
    // Verify issue access
    await this.findOne(issueId, userId);
    
    return (this.prisma as any).issue.findMany({
      where: {
        parentId: issueId,
      },
      include: {
        creator: true,
        assignee: true,
        milestone: true,
        comments: {
          include: {
            author: true,
          },
        },
        branches: true,
        pullRequests: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
