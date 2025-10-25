import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedGuard } from './authenticated.guard';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private configService: ConfigService) {}
    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth(@Req() req: Request) {

    }
    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const clientUrl = this.configService.get('CLIENT_HOMEPAGE_URL');

        res.redirect(clientUrl);
    }
    @Get('status')
    @UseGuards(AuthenticatedGuard)
    getUserStatus(@Req() req: Request) {

        return req.user;
    }

}
