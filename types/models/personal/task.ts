// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/personal/task.ts
================================================================================

// types/models/personal/task.ts
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: TaskPriority;
  category: string;
  createdAt: number;
}
