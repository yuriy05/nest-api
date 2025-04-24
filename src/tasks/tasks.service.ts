import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskStatusType } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly labelRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams,
  ): Promise<[Task[], number]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...labelsName)', {
          labelsName: filters.labels,
        })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);

      // **
      // * Filter by label name
      // **
      // query.andWhere('labels.name IN (:...labelsName)', {
      //   labelsName: filters.labels,
      // });
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();

    // const where: FindOptionsWhere<Task> = {};

    // if (filters.status) {
    //   where.status = filters.status;
    // }

    // if (filters.search?.trim()) {
    //   where.title = Like(`%${filters.search}%`);
    //   where.description = Like(`%${filters.search}%`);
    // }

    // return await this.taskRepository.findAndCount({
    //   where,
    //   relations: ['labels'],
    //   skip: pagination.offset,
    //   take: pagination.limit,
    // });
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: {
        id,
      },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }

    return await this.taskRepository.save(createTaskDto);
  }

  public async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete({ id });
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  public async addLabels(
    task: Task,
    labelsDto: CreateTaskLabelDto[],
  ): Promise<Task> {
    const existingNames = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelsDto)
      .filter((dto) => !existingNames.has(dto.name))
      .map((label) => this.labelRepository.create(label));

    if (labels.length > 0) {
      task.labels = [...task.labels, ...labels];

      return await this.taskRepository.save(task);
    }

    return task;
  }

  public async removeLabels(
    task: Task,
    lablesToRemove: string[],
  ): Promise<Task> {
    task.labels = task.labels.filter(
      (label) => !lablesToRemove.includes(label.name),
    );

    return await this.taskRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatusType,
    newStatus: TaskStatusType,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];

    return uniqueNames.map((name) => ({ name }));
  }
}
