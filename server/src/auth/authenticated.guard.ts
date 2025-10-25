import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated();
  }
}
