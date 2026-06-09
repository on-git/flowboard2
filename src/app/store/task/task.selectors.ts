import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(selectTaskState, (state) => state.tasks);

export const selectIsLoading = createSelector(selectTaskState, (state) => state.isLoading);

export const selectError = createSelector(selectTaskState, (state) => state.error);

export const selectTodoCount = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((t) => t.status === 'todo').length,
);

export const selectInProgressCount = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((t) => t.status === 'in-progress').length,
);

export const selectDoneCount = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((t) => t.status === 'done').length,
);

export const selectFilterStatus = createSelector(selectTaskState, (state) => state.filterStatus);

export const selectFilterPriority = createSelector(
  selectTaskState,
  (state) => state.filterPriority,
);

export const selectSearchQuery = createSelector(selectTaskState, (state) => state.searchQuery);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilterStatus,
  selectFilterPriority,
  selectSearchQuery,
  (tasks, filterStatus, filterPriority, searchQuery) => {
    let filtered = tasks;
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    return filtered;
  },
);
