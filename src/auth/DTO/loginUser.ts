import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser';

export class LoginUserDto extends OmitType(CreateUserDto, [
  'name',
  'role',
] as const) {}
