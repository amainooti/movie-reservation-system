import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './DTO';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async hashPass(userPass: string): Promise<string> {
    return bcrypt.hash(userPass, 10);
  }

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ newUser: Omit<CreateUserDto, 'password'>; message: string }> {
    try {
      const userExist = await this.prismaService.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (userExist) throw new ConflictException('User already exist');
      //   Hash password
      const hashedPassword = await this.hashPass(createUserDto.password);

      const newUser = await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      });

      const { password, ...userWithoutPassword } = newUser;
      return {
        message: 'Successfully Created',
        newUser: userWithoutPassword,
      };
    } catch (error) {
      throw error;
    }
  }
}
