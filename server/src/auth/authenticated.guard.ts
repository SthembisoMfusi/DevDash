import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

interface AuthenticatedRequest {
  isAuthenticated(): boolean;
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as AuthenticatedRequest;
    return req.isAuthenticated();
  }
}
