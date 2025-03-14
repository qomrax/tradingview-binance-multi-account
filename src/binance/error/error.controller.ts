import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/jwt.decorator';
import { PaginationInputDto } from './dto/pagination.dto';
import { Errors } from './dto/errors.dto';
import { ErrorService } from './error.service';
@Controller('errors')
export class ErrorController {

  constructor(private errorService: ErrorService) {

  }

  @JwtAuth()
  @Get("error")
  @ApiResponse({ type: Errors })
  async find(@Query() paginationInputDto: PaginationInputDto) {
    return await this.errorService.pagination(paginationInputDto.page, paginationInputDto.limit)
  }
}
