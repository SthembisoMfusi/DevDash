import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, user: any) => void): void {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: any, user: any) => void): void {
    // This now correctly accepts 'payload' (the user object)
    done(null, payload);
  }
}
