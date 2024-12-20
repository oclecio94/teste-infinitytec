import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDTO, signupDTO } from './auth.dto';
import { ZodValidation } from 'src/validation/zod.validation';
import { SignInSchema, SignUpSchema } from './auth.validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body(new ZodValidation(SignUpSchema)) data: signupDTO) {
    return this.authService.signUp(data);
  }

  @Post('signin')
  signIn(@Body(new ZodValidation(SignInSchema)) data: signinDTO) {
    return this.authService.signIn(data);
  }
}
