import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {


    serializeUser(user: any, done: (err: Error, user: any) => void): any {

        done(null , user);
    }


    deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {
        // For now, the 'payload' is the full user object we saved.
        // LATER: This 'payload' will be just the 'user.id', and we'll
        // use it to find the user in our database.
        done(null, payload);
    }
}