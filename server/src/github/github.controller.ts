import { Controller, Get, Post, Body, Req, UseGuards, Headers } from '@nestjs/common';
import { GitHubService } from './github.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('github')
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  @Get('repositories')
  @UseGuards(AuthenticatedGuard)
  getUserRepositories(@Req() req: any) {
    return this.githubService.getUserRepositories(req.user.id);
  }

  @Post('webhook')
  handleWebhook(@Body() payload: any, @Headers('x-github-event') eventType: string) {
    return this.githubService.handleWebhookEvent(eventType, payload);
  }
}
