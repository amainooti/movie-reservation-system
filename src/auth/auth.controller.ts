import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDTO: CreateUserDto) {
    return this.authService.signUp(createUserDTO);
  }

  @Post('sign-in')
  signIn(@Body() loginUser: LoginUserDto) {
    return this.authService.signIn(loginUser);
  }
}
