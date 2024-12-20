import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDTO, signupDTO } from './auth.dto';
import { ZodValidation } from 'src/validation/zod.validation';
import { SignInSchema, SignUpSchema } from './auth.validation';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 200, description: 'user created successfully' })
  @ApiResponse({ status: 400, description: 'user already exists' })
  signUp(@Body(new ZodValidation(SignUpSchema)) data: signupDTO) {
    return this.authService.signUp(data);
  }

  @Post('signin')
  @ApiResponse({ status: 201, description: 'user signed in successfully' })
  @ApiResponse({ status: 401, description: 'user not authorized' })
  signIn(@Body(new ZodValidation(SignInSchema)) data: signinDTO) {
    return this.authService.signIn(data);
  }
}
