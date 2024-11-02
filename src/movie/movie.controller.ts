import { Body, Controller, Get, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDTO } from './DTO';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Get('')
  findAll() {}

  @Roles('ADMIN')
  @Post('create')
  create(@Body() createMovieDTO: CreateMovieDTO) {
    return this.movieService.create(createMovieDTO);
  }
}
