import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, LinkRepositoryDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    return (this.prisma as any).project.create({
      data: {
        ...createProjectDto,
        ownerId: userId,
      },
      include: {
        owner: true,
        repositories: true,
        _count: {
          select: {
            issues: true,
            milestones: true,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return (this.prisma as any).project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
        repositories: true,
        _count: {
          select: {
            issues: true,
            milestones: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const project = await (this.prisma as any).project.findUnique({
      where: { id },
      include: {
        owner: true,
        repositories: true,
        issues: {
          include: {
            assignee: true,
            creator: true,
            milestone: true,
            _count: {
              select: {
                comments: true,
                subtasks: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        milestones: {
          include: {
            _count: {
              select: {
                issues: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        templates: {
          where: {
            OR: [
              { isBase: true },
              { creatorId: userId },
            ],
          },
          include: {
            creator: true,
          },
        },
        _count: {
          select: {
            issues: true,
            milestones: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    const project = await this.findOne(id, userId);
    
    return (this.prisma as any).project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        owner: true,
        repositories: true,
        _count: {
          select: {
            issues: true,
            milestones: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const project = await this.findOne(id, userId);
    
    return (this.prisma as any).project.delete({
      where: { id },
    });
  }

  async linkRepository(id: number, linkRepositoryDto: LinkRepositoryDto, userId: number) {
    const project = await this.findOne(id, userId);
    
    // Check if repository is already linked
    const existingRepo = await (this.prisma as any).gitHubRepository.findFirst({
      where: {
        projectId: id,
        fullName: linkRepositoryDto.fullName,
      },
    });

    if (existingRepo) {
      throw new Error('Repository is already linked to this project');
    }

    return (this.prisma as any).gitHubRepository.create({
      data: {
        ...linkRepositoryDto,
        projectId: id,
      },
    });
  }

  async unlinkRepository(projectId: number, repositoryId: number, userId: number) {
    const project = await this.findOne(projectId, userId);
    
    const repository = await (this.prisma as any).gitHubRepository.findUnique({
      where: { id: repositoryId },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    if (repository.projectId !== projectId) {
      throw new ForbiddenException('Repository does not belong to this project');
    }

    return (this.prisma as any).gitHubRepository.delete({
      where: { id: repositoryId },
    });
  }
}
