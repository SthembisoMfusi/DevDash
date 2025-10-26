import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async create(createMilestoneDto: CreateMilestoneDto, userId: number) {
    // Verify project exists and user has access
    const project = await (this.prisma as any).project.findUnique({
      where: { id: createMilestoneDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return (this.prisma as any).milestone.create({
      data: createMilestoneDto,
      include: {
        project: true,
        _count: {
          select: {
            issues: true,
          },
        },
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

    return (this.prisma as any).milestone.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
        issues: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const milestone = await (this.prisma as any).milestone.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            owner: true,
          },
        },
        issues: {
          include: {
            assignee: true,
            creator: true,
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
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this milestone');
    }

    return milestone;
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto, userId: number) {
    const milestone = await this.findOne(id, userId);
    
    return (this.prisma as any).milestone.update({
      where: { id },
      data: updateMilestoneDto,
      include: {
        project: true,
        issues: {
          include: {
            assignee: true,
            creator: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const milestone = await this.findOne(id, userId);
    
    return (this.prisma as any).milestone.delete({
      where: { id },
    });
  }

  async getProgress(id: number, userId: number) {
    const milestone = await this.findOne(id, userId);
    
    const totalIssues = milestone.issues.length;
    const completedIssues = milestone.issues.filter(issue => issue.status === 'DONE').length;
    const progressPercentage = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    return {
      milestone,
      progress: {
        totalIssues,
        completedIssues,
        progressPercentage,
      },
    };
  }
}
