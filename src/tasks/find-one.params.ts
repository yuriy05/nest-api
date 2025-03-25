import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class FindOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
