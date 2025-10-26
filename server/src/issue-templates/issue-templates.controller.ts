import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { IssueTemplatesService } from './issue-templates.service';
import { CreateIssueTemplateDto, UpdateIssueTemplateDto, CreateIssueFromTemplateDto } from './dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('issue-templates')
@UseGuards(AuthenticatedGuard)
export class IssueTemplatesController {
  constructor(private readonly issueTemplatesService: IssueTemplatesService) {}

  @Post()
  create(@Body() createTemplateDto: CreateIssueTemplateDto, @Req() req: any) {
    return this.issueTemplatesService.create(createTemplateDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any, @Query('projectId') projectId?: string) {
    return this.issueTemplatesService.findAll(req.user.id, projectId ? +projectId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.issueTemplatesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateIssueTemplateDto, @Req() req: any) {
    return this.issueTemplatesService.update(+id, updateTemplateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.issueTemplatesService.remove(+id, req.user.id);
  }

  @Post('create-issue')
  createIssueFromTemplate(@Body() createIssueDto: CreateIssueFromTemplateDto, @Req() req: any) {
    return this.issueTemplatesService.createIssueFromTemplate(createIssueDto, req.user.id);
  }

  @Post('seed-base')
  seedBaseTemplates() {
    return this.issueTemplatesService.seedBaseTemplates();
  }
}
