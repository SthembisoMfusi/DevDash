import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedGuard } from './authenticated.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
    const tokens = await this.authService.login(req.user);
    req.login(req.user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      res.json(tokens);
    });
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth(): void {
    // GitHub OAuth will handle the redirect
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // Check if user exists before logging in
    if (!req.user) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
    
    // Explicitly log the user in to ensure session is created
    req.login(req.user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      
      const clientUrl = this.configService.get('CLIENT_HOMEPAGE_URL') as string;
      res.redirect(clientUrl);
    });
  }

  @Get('github/link')
  @UseGuards(AuthenticatedGuard, AuthGuard('github'))
  githubLink() {
    // Redirect to GitHub for linking
  }

  @Get('github/link/callback')
  @UseGuards(AuthenticatedGuard, AuthGuard('github'))
  async githubLinkCallback(@Req() req: any, @Res() res: Response) {
    // Link GitHub to current user
    if (req.user && (req.user as any).githubAccessToken) {
      await this.prisma.user.update({
        where: { id: req.user.id },
        data: {
          githubId: (req.user as any).githubId,
          githubUsername: (req.user as any).githubUsername,
          githubAccessToken: (req.user as any).githubAccessToken,
          githubLinkedAt: new Date(),
        },
      });
    }
    const clientUrl = this.configService.get('CLIENT_HOMEPAGE_URL') as string;
    res.redirect(`${clientUrl}/settings`);
  }

  @Post('github/unlink')
  @UseGuards(AuthenticatedGuard)
  async githubUnlink(@Req() req: any) {
    if (!req.user) {
      throw new Error('User not found');
    }
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: {
        githubId: null,
        githubUsername: null,
        githubAccessToken: null,
        githubLinkedAt: null,
      },
    });
    return { message: 'GitHub unlinked successfully' };
  }


  @Get('status')
  getUserStatus(@Req() req: any) {
    return req.user || null;
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
