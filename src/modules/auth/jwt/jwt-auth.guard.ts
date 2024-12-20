import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY, Roles } from '../auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const requiredRole = this.reflector.getAllAndOverride<Roles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      const userRole = payload.role;

      if (userRole !== requiredRole) {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
