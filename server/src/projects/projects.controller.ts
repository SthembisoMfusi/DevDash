import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, LinkRepositoryDto } from './dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('projects')
@UseGuards(AuthenticatedGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req: any) {
    return this.projectsService.update(+id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.remove(+id, req.user.id);
  }

  @Post(':id/repositories')
  linkRepository(@Param('id') id: string, @Body() linkRepositoryDto: LinkRepositoryDto, @Req() req: any) {
    return this.projectsService.linkRepository(+id, linkRepositoryDto, req.user.id);
  }

  @Delete(':id/repositories/:repositoryId')
  unlinkRepository(@Param('id') id: string, @Param('repositoryId') repositoryId: string, @Req() req: any) {
    return this.projectsService.unlinkRepository(+id, +repositoryId, req.user.id);
  }
}
