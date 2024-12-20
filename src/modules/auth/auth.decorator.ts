import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, JwtStrategy),
  );
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
