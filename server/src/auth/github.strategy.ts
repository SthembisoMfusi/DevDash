import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID') as string,
      clientSecret: configService.get('GITHUB_CLIENT_SECRET') as string,
      callbackURL: configService.get('GITHUB_CALLBACK_URL') as string,
      scope: ['read:user', 'user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    try {
      console.log('GitHub Profile:', profile.username);

      // Find user by githubId (if already linked)
      let user = await this.prisma.user.findUnique({
        where: { githubId: parseInt(profile.id) },
      });

      if (user) {
        // Update GitHub info
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            githubUsername: profile.username || profile.id,
            githubAccessToken: accessToken,
            githubLinkedAt: new Date(),
          },
        });
      }

      // Return user with access token for linking
      done(null, user ? { ...user, githubAccessToken: accessToken } : null);
    } catch (error) {
      console.error('Error in GitHub strategy validation:', error);
      done(error, null);
    }
  }
}
