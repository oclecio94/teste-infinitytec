import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: '3h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [JwtModule, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
