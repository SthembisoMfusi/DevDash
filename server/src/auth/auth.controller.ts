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
  githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('GitHub callback - req.user:', req.user);
    console.log('GitHub callback - req.isAuthenticated():', req.isAuthenticated());
    console.log('GitHub callback - session after auth:', req.session);
    
    // Check if user exists before logging in
    if (!req.user) {
      console.error('No user found in request');
      return res.status(500).json({ error: 'Authentication failed' });
    }
    
    // Explicitly log the user in to ensure session is created
    req.login(req.user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      
      console.log('User logged in successfully, session:', req.session);
      const clientUrl = this.configService.get('CLIENT_HOMEPAGE_URL') as string;
      res.redirect(clientUrl);
    });
  }

  @Get('debug')
  debugSession(@Req() req: Request) {
    console.log('Debug endpoint - cookies:', req.headers.cookie);
    console.log('Debug endpoint - session:', req.session);
    return {
      session: req.session,
      cookies: req.headers.cookie,
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      sessionID: req.sessionID,
      headers: req.headers,
    };
  }

  @Get('test')
  testSession(@Req() req: Request) {
    console.log('Test endpoint - session:', req.session);
    console.log('Test endpoint - cookies:', req.headers.cookie);
    return { 
      session: req.session, 
      cookies: req.headers.cookie,
      isAuthenticated: req.isAuthenticated(),
      user: req.user 
    };
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  getUserStatus(@Req() req: Request) {
    console.log('Auth status check - req.user:', req.user);
    console.log('Auth status check - req.isAuthenticated():', req.isAuthenticated());
    console.log('Auth status check - session:', req.session);
    console.log('Auth status check - cookies:', req.headers.cookie);
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
