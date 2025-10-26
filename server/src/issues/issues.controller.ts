import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto, UpdateIssueDto, CreateCommentDto, IssueStatus } from './dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('issues')
@UseGuards(AuthenticatedGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() createIssueDto: CreateIssueDto, @Req() req: any) {
    return this.issuesService.create(createIssueDto, req.user.id);
  }

  @Get()
  findAll(@Query('projectId') projectId: string, @Req() req: any) {
    return this.issuesService.findAll(+projectId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.issuesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto, @Req() req: any) {
    return this.issuesService.update(+id, updateIssueDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.issuesService.remove(+id, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: IssueStatus, @Req() req: any) {
    return this.issuesService.updateStatus(+id, status, req.user.id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    return this.issuesService.addComment({ ...createCommentDto, issueId: +id }, req.user.id);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string, @Req() req: any) {
    return this.issuesService.getComments(+id, req.user.id);
  }

  @Get(':id/subtasks')
  getSubtasks(@Param('id') id: string, @Req() req: any) {
    return this.issuesService.getSubtasks(+id, req.user.id);
  }
}
