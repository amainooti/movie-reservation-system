import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDTO } from './DTO';

@Injectable()
export class MovieService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMovie: CreateMovieDTO) {
    try {
      const movie = await this.prismaService.movie.create({
        data: {
          ...createMovie,
        },
      });

      return movie;
    } catch (error) {
      throw error;
    }
  }
}
