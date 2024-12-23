import { ApiProperty } from '@nestjs/swagger';

export class signupDTO {
  @ApiProperty({
    type: 'string',
    description: 'name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'email of the user',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({ type: 'string', description: 'password of the user' })
  password: string;
}

export class signinDTO {
  @ApiProperty({
    type: 'string',
    description: 'email of the user',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({ type: 'string', description: 'password of the user' })
  password: string;
}
