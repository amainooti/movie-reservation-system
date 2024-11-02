import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDTO } from './CreateMovieDTO';

export class UpdateMovieDTO extends PartialType(CreateMovieDTO) {}
