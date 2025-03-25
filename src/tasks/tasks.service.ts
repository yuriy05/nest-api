import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      ...createTaskDto,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
