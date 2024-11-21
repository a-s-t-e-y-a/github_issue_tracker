import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GithubUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  slack_webhook: string;
}

class GithubUrlDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  type_issues: string[];
}

export class CreateDto {
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  @Type(() => GithubUserDto)
  user: GithubUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [GithubUrlDto] })
  @Type(() => GithubUrlDto)
  urls: GithubUrlDto[];
}