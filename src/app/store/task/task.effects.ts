import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskApiService } from '../../services/task-api';
import { TaskActions } from './task.actions';

@Injectable()
export class TaskEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TaskApiService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.api.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) => of(TaskActions.loadTasksFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.api.createTask(task).pipe(
          map((newTask) => TaskActions.addTaskSuccess({ task: newTask })),
          catchError((error) => of(TaskActions.addTaskFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.api.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) => of(TaskActions.deleteTaskFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateStatus),
      switchMap(({ id, status }) =>
        this.api.updateTask(id, { status }).pipe(
          map((task) => TaskActions.updateStatusSuccess({ task })),
          catchError((error) => of(TaskActions.updateStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
