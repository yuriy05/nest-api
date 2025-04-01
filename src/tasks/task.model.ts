export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatusType;
}

export const TaskStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
