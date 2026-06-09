import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Add Task': props<{ task: Omit<Task, 'id'> }>(),
    'Add Task Success': props<{ task: Task }>(),
    'Add Task Failure': props<{ error: string }>(),

    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    'Update Status': props<{ id: string; status: Task['status'] }>(),
    'Update Status Success': props<{ task: Task }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Set Filter Status': props<{ status: Task['status'] | 'all' }>(),
    'Set Filter Priority': props<{ priority: Task['priority'] | 'all' }>(),
    'Set Search Query': props<{ query: string }>(),
  },
});
