import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './DTO';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
  ) {}

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
          role: createUserDto.role,
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

  async signIn(
    loginUser: LoginUserDto,
  ): Promise<{ message: string; token: string }> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: loginUser.email,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      const isPasswordMatch = await bcrypt.compare(
        loginUser.password,
        user.password,
      );

      if (!isPasswordMatch)
        throw new UnauthorizedException('Invalid credentials');

      const { password, ...userTokenPayload } = user;

      const payload = {
        sub: userTokenPayload.id,
        name: userTokenPayload.name,
        role: userTokenPayload.role,
      };

      const token = jwt.sign(payload, this.config.get<string>('SECRET'), {
        expiresIn: '1h',
      });

      return {
        message: 'Login Successful',
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
