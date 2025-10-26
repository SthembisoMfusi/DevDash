import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('milestones')
@UseGuards(AuthenticatedGuard)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  create(@Body() createMilestoneDto: CreateMilestoneDto, @Req() req: any) {
    return this.milestonesService.create(createMilestoneDto, req.user.id);
  }

  @Get()
  findAll(@Query('projectId') projectId: string, @Req() req: any) {
    return this.milestonesService.findAll(+projectId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.milestonesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMilestoneDto: UpdateMilestoneDto, @Req() req: any) {
    return this.milestonesService.update(+id, updateMilestoneDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.milestonesService.remove(+id, req.user.id);
  }

  @Get(':id/progress')
  getProgress(@Param('id') id: string, @Req() req: any) {
    return this.milestonesService.getProgress(+id, req.user.id);
  }
}
