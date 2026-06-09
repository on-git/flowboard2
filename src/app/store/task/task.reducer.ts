import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import { TaskActions } from './task.actions';

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filterStatus: Task['status'] | 'all';
  filterPriority: Task['priority'] | 'all';
  searchQuery: string;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filterStatus: 'all',
  filterPriority: 'all',
  searchQuery: '',
};

export const taskReducer = createReducer(
  initialState,

  on(TaskActions.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    isLoading: false,
  })),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),

  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
  })),

  on(TaskActions.updateStatusSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),

  on(TaskActions.setFilterStatus, (state, { status }) => ({
    ...state,
    filterStatus: status,
  })),

  on(TaskActions.setFilterPriority, (state, { priority }) => ({
    ...state,
    filterPriority: priority,
  })),

  on(TaskActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),
);
