import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsUrl()
  @IsNotEmpty()
  image: string;
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsMongoId()
  author: string;
}
