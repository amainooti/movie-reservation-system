import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './DTO';

@Injectable()
export class AuthService {
    constructor(){}



    signUp(createUserDto: CreateUserDto){
        return createUserDto;
    }
}
