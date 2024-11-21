import { Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { PrismaService } from 'nestjs-prisma';
import { username } from '@prisma/client';
import axios from 'axios';
import { CreateResponse } from './interface/response.interface';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Hello World!');
      }, 2000);
    });
  }

  private async isValidGithubUsername(username: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private async checkUrl(url: string): Promise<boolean> {
    try {
      const repoName = url
        .replace(/^@?https?:\/\/github\.com\//, '')
        .replace(/^\/|\/$/g, '')
        .replace(/\.git$/, '');
      console.log(repoName);
      const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
        validateStatus: status => status === 200
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async create(body: CreateDto): Promise<CreateResponse> {
    const isValid = await this.isValidGithubUsername(body.user.username);
    
    if (!isValid) {
      throw new BadRequestException('Invalid GitHub username');
    }

    const urlValidationResults = await Promise.all(
      body.urls.map((url) => this.checkUrl(url.url))
    );

    if (urlValidationResults.includes(false)) {
      throw new BadRequestException('One or more URLs are invalid');
    }

    const data = await this.prisma.username.create({
      data: {
        username: body.user.username,
        slack_webhook: body.user.slack_webhook,
        githubUrl: {
          create: body.urls.map((url) => ({
            url: url.url,
            type_issues: url.type_issues,
          })),
        },
      },
    });

    return {
      message: 'Created successfully',
      data,
    };
  }

  async get(username: string): Promise<username[]> {
    return await this.prisma.username.findMany({
      where: {
        username: username,
      },
      include: {
        githubUrl: true,
      },
    });
  }
}
