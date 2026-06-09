import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TaskCard } from '../../components/task-card/task-card';
import { TaskFormComponent } from '../../components/task-form/task-form';
import { Task } from '../../models/task.model';
import { TaskActions } from '../../store/task/task.actions';
import {
  selectFilteredTasks,
  selectIsLoading,
  selectError,
  selectFilterStatus,
  selectFilterPriority,
} from '../../store/task/task.selectors';

@Component({
  selector: 'app-home',
  imports: [TaskCard, TaskFormComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly store = inject(Store);
  private readonly searchSubject = new Subject<string>();

  protected selectedTask = signal<Task | null>(null);
  protected readonly tasks = this.store.selectSignal(selectFilteredTasks);
  protected readonly isLoading = this.store.selectSignal(selectIsLoading);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly filterStatus = this.store.selectSignal(selectFilterStatus);
  protected readonly filterPriority = this.store.selectSignal(selectFilterPriority);

  constructor() {
    this.store.dispatch(TaskActions.loadTasks());

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((query) => {
        this.store.dispatch(TaskActions.setSearchQuery({ query }));
      });
  }

  protected onSearch(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  protected onTaskSelected(task: Task): void {
    this.selectedTask.set(task);
  }

  protected deleteTask(id: string): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
    if (this.selectedTask()?.id === id) {
      this.selectedTask.set(null);
    }
  }

  protected addTask(task: Omit<Task, 'id'>): void {
    this.store.dispatch(TaskActions.addTask({ task }));
  }

  protected updateStatus(event: { id: string; status: Task['status'] }): void {
    this.store.dispatch(TaskActions.updateStatus({ id: event.id, status: event.status }));
  }

  protected setFilterStatus(event: Event): void {
    this.store.dispatch(
      TaskActions.setFilterStatus({
        status: (event.target as HTMLSelectElement).value as Task['status'] | 'all',
      }),
    );
  }

  protected setFilterPriority(event: Event): void {
    this.store.dispatch(
      TaskActions.setFilterPriority({
        priority: (event.target as HTMLSelectElement).value as Task['priority'] | 'all',
      }),
    );
  }
}
