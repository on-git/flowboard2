import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskCard } from '../../components/task-card/task-card';
import { TaskFormComponent } from '../../components/task-form/task-form';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-home',
  imports: [TaskCard, TaskFormComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly taskService = inject(TaskService);
  private readonly searchSubject = new Subject<string>();

  protected selectedTask = signal<Task | null>(null);
  protected readonly tasks = this.taskService.filteredTasks;
  protected readonly filterStatus = this.taskService.filterStatus;
  protected readonly filterPriority = this.taskService.filterPriority;

  protected readonly isLoading = this.taskService.isLoading;
  protected readonly error = this.taskService.error;

  constructor() {
    this.taskService.loadTasks();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((query) => {
        this.taskService.setSearchQuery(query);
      });
  }

  protected onSearch(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  protected onTaskSelected(task: Task): void {
    this.selectedTask.set(task);
  }

  protected deleteTask(id: string): void {
    this.taskService.deleteTask(id);
    if (this.selectedTask()?.id === id) {
      this.selectedTask.set(null);
    }
  }

  protected addTask(task: Omit<Task, 'id'>): void {
    this.taskService.addTask(task);
  }

  protected updateStatus(task: { id: string; status: Task['status'] }): void {
    this.taskService.updateStatus(task.id, task.status);
  }

  protected setFilterStatus(event: Event): void {
    this.taskService.setFilterStatus(
      (event.target as HTMLSelectElement).value as Task['status'] | 'all',
    );
  }

  protected setFilterPriority(event: Event): void {
    this.taskService.setFilterPriority(
      (event.target as HTMLSelectElement).value as Task['priority'] | 'all',
    );
  }
}
