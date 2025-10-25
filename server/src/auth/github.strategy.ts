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

      // Find or create user in database
      const user = await this.prisma.user.upsert({
        where: { githubId: parseInt(profile.id) },
        update: {
          username: profile.username || profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatarUrl: profile.photos?.[0]?.value,
        },
        create: {
          githubId: parseInt(profile.id),
          username: profile.username || profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatarUrl: profile.photos?.[0]?.value,
        },
      });

      // Store access token for future GitHub API calls
      const userWithToken = {
        ...user,
        githubAccessToken: accessToken,
      };

      done(null, userWithToken);
    } catch (error) {
      console.error('Error in GitHub strategy validation:', error);
      done(error, null);
    }
  }
}
