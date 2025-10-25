import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, user: any) => void): void {
    console.log('Serializing user:', user);
    // Store the user object in the session
    done(null, user);
  }

  deserializeUser(user: any, done: (err: any, user: any) => void): void {
    console.log('Deserializing user:', user);
    // Return the user object from the session
    done(null, user);
  }
}
