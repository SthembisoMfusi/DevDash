import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedGuard } from './authenticated.guard';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth(): void {
    // GitHub OAuth will handle the redirect
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Res() res: Response): void {
    const clientUrl = this.configService.get('CLIENT_HOMEPAGE_URL') as string;
    res.redirect(clientUrl);
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  getUserStatus(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response): void {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        res.status(500).json({ error: 'Logout failed' });
      } else {
        res.json({ message: 'Logged out successfully' });
      }
    });
  }
}
