import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { compare, hash } from 'bcrypt';
import { signinDTO, signupDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(data: signupDTO) {
    const { name, email, password } = data;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException({
        success: false,
        message: 'user already exists',
      });
    }

    const hashedPassword = await hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    await this.prisma.user.create({ data: user });

    const { password: _, ...result } = user;
    return result;
  }

  async signIn(data: signinDTO) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'not authorized',
      });
    }

    const isEqualPassword = await compare(password, user.password);

    if (!isEqualPassword) {
      throw new BadRequestException({
        success: false,
        message: 'not authorized',
      });
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
