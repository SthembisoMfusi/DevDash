import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueTemplateDto, UpdateIssueTemplateDto, CreateIssueFromTemplateDto } from './dto';
import { IssuesService } from '../issues/issues.service';
import { Priority } from '../issues/dto';

@Injectable()
export class IssueTemplatesService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
  ) {}

  async create(createTemplateDto: CreateIssueTemplateDto, userId: number) {
    // If projectId is provided, verify access
    if (createTemplateDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: createTemplateDto.projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenException('You do not have access to this project');
      }
    }

    return this.prisma.issueTemplate.create({
      data: {
        ...createTemplateDto,
        creatorId: userId,
      },
      include: {
        creator: true,
        project: true,
      },
    });
  }

  async findAll(userId: number, projectId?: number) {
    const where: any = {
      OR: [
        { isBase: true },
        { creatorId: userId },
      ],
    };

    if (projectId) {
      where.OR.push({ projectId });
    }

    return this.prisma.issueTemplate.findMany({
      where,
      include: {
        creator: true,
        project: true,
      },
      orderBy: [
        { isBase: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: number, userId: number) {
    const template = await this.prisma.issueTemplate.findUnique({
      where: { id },
      include: {
        creator: true,
        project: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check access (base templates are accessible to all, custom templates only to creator)
    if (!template.isBase && template.creatorId !== userId) {
      throw new ForbiddenException('You do not have access to this template');
    }

    return template;
  }

  async update(id: number, updateTemplateDto: UpdateIssueTemplateDto, userId: number) {
    const template = await this.findOne(id, userId);
    
    // Only allow updates to custom templates
    if (template.isBase) {
      throw new ForbiddenException('Cannot modify base templates');
    }

    return this.prisma.issueTemplate.update({
      where: { id },
      data: updateTemplateDto,
      include: {
        creator: true,
        project: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const template = await this.findOne(id, userId);
    
    // Only allow deletion of custom templates
    if (template.isBase) {
      throw new ForbiddenException('Cannot delete base templates');
    }

    return this.prisma.issueTemplate.delete({
      where: { id },
    });
  }

  async createIssueFromTemplate(createIssueDto: CreateIssueFromTemplateDto, userId: number) {
    const template = await this.findOne(createIssueDto.templateId, userId);
    
    // Verify project access
    const project = await this.prisma.project.findUnique({
      where: { id: createIssueDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Process template data
    const processedData = this.processTemplateData(template.fields, createIssueDto.templateData);

    // Create issue using the issues service
    return this.issuesService.create({
      ...processedData,
      projectId: createIssueDto.projectId,
    }, userId);
  }

  async seedBaseTemplates() {
    const baseTemplates = [
      {
        name: 'Bug Report',
        description: 'Template for reporting bugs',
        isBase: true,
        fields: {
          title: 'Bug: {title}',
          description: '## Description\n{description}\n\n## Steps to Reproduce\n1. {step1}\n2. {step2}\n3. {step3}\n\n## Expected Behavior\n{expected}\n\n## Actual Behavior\n{actual}\n\n## Environment\n- OS: {os}\n- Browser: {browser}\n- Version: {version}',
          priority: 'HIGH',
          labels: ['bug'],
        },
        creatorId: 1, // System user
      },
      {
        name: 'Feature Request',
        description: 'Template for requesting new features',
        isBase: true,
        fields: {
          title: 'Feature: {title}',
          description: '## Summary\n{summary}\n\n## Motivation\n{motivation}\n\n## Proposed Solution\n{solution}\n\n## Alternatives Considered\n{alternatives}\n\n## Additional Context\n{context}',
          priority: 'MEDIUM',
          labels: ['enhancement'],
        },
        creatorId: 1, // System user
      },
      {
        name: 'Task',
        description: 'Template for general tasks',
        isBase: true,
        fields: {
          title: '{title}',
          description: '## Description\n{description}\n\n## Acceptance Criteria\n- [ ] {criteria1}\n- [ ] {criteria2}\n- [ ] {criteria3}\n\n## Notes\n{notes}',
          priority: 'MEDIUM',
          labels: ['task'],
        },
        creatorId: 1, // System user
      },
      {
        name: 'User Story',
        description: 'Template for user stories',
        isBase: true,
        fields: {
          title: 'As a {user}, I want {goal} so that {benefit}',
          description: '## User Story\nAs a {user}, I want {goal} so that {benefit}.\n\n## Acceptance Criteria\n- [ ] {criteria1}\n- [ ] {criteria2}\n- [ ] {criteria3}\n\n## Definition of Done\n- [ ] {done1}\n- [ ] {done2}\n- [ ] {done3}',
          priority: 'MEDIUM',
          labels: ['user-story'],
          storyPoints: 5,
        },
        creatorId: 1, // System user
      },
    ];

    // Check if base templates already exist
    const existingBaseTemplates = await this.prisma.issueTemplate.findMany({
      where: { isBase: true },
    });

    if (existingBaseTemplates.length === 0) {
      await this.prisma.issueTemplate.createMany({
        data: baseTemplates,
      });
    }

    return baseTemplates;
  }

  private processTemplateData(templateFields: any, templateData: any) {
    const processedData: any = {
      title: templateFields.title || '',
      description: templateFields.description || '',
      priority: templateFields.priority || Priority.MEDIUM,
      labels: templateFields.labels || [],
      storyPoints: templateFields.storyPoints,
    };

    // Replace placeholders in title and description
    Object.keys(templateData).forEach(key => {
      const placeholder = `{${key}}`;
      processedData.title = processedData.title.replace(new RegExp(placeholder, 'g'), templateData[key]);
      processedData.description = processedData.description.replace(new RegExp(placeholder, 'g'), templateData[key]);
    });

    return processedData;
  }
}
