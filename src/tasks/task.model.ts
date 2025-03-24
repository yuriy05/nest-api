export interface Task {
  id: string;
  title: string;
  description: string;
  status: (typeof TaskStatus)[keyof typeof TaskStatus];
}

export const TaskStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;
