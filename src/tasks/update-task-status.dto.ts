import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from './task.model';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: (typeof TaskStatus)[keyof typeof TaskStatus];
}
