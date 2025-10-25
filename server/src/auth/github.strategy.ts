import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {


    constructor(private configService: ConfigService) {

        super({
            clientID: configService.get('GITHUB_CLIENT_ID') as string,
            clientSecret: configService.get('GITHUB_CLIENT_SECRET') as string,
            callbackURL: configService.get('GITHUB_CALLBACK_URL') as string,
            scope: ['read:user', 'user:email'],
        });
    }


    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {


        console.log('GitHub Profile:', profile.username);

        // Later, this is where we'll use the 'profile' data to
        // find or create a user in our PostgreSQL database.

        // 'done' is a callback that Passport uses. We pass null (for no error)
        // and the 'profile' (which becomes the 'user' object).
        done(null, profile);
    }
}