import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
import { ApiBody } from '@nestjs/swagger';
import { CreateResponse } from './interface/response.interface';
import { username } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':username')
  getHello(@Param('username') username: string): Promise<username[]> {
    return this.appService.get(username);
  }

  @Post('create')
  @ApiBody({ type: CreateDto })
  async create(@Body() body: CreateDto): Promise<CreateResponse> {
    const data = await this.appService.create(body);
    return {
      message: data.message,
      data: data.data,
    };
  }
}
