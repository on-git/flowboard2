import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskApiService } from './task-api';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly api = inject(TaskApiService);

  private readonly _tasks = signal<Task[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filterStatus = signal<Task['status'] | 'all'>('all');
  readonly filterPriority = signal<Task['priority'] | 'all'>('all');
  readonly searchQuery = signal<string>('');

  readonly filteredTasks = computed(() => {
    let tasks = this._tasks();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
      );
    }

    if (this.filterStatus() !== 'all') {
      tasks = tasks.filter((t) => t.status === this.filterStatus());
    }

    if (this.filterPriority() !== 'all') {
      tasks = tasks.filter((t) => t.priority === this.filterPriority());
    }

    return tasks;
  });

  readonly tasks = this._tasks.asReadonly();

  readonly todoCount = computed(() => this._tasks().filter((t) => t.status === 'todo').length);

  readonly inProgressCount = computed(
    () => this._tasks().filter((t) => t.status === 'in-progress').length,
  );

  readonly doneCount = computed(() => this._tasks().filter((t) => t.status === 'done').length);

  loadTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getTasks().subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Görevler yüklenemedi.');
        this.isLoading.set(false);
      },
    });
  }

  setFilterStatus(status: Task['status'] | 'all'): void {
    this.filterStatus.set(status);
  }

  setFilterPriority(priority: Task['priority'] | 'all'): void {
    this.filterPriority.set(priority);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  addTask(task: Omit<Task, 'id'>): void {
    this.api.createTask(task).subscribe({
      next: (newTask) => {
        this._tasks.update((tasks) => [...tasks, newTask]);
      },
      error: () => this.error.set('Görev eklenemedi.'),
    });
  }

  deleteTask(id: number): void {
    this.api.deleteTask(id).subscribe({
      next: () => {
        this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
      },
      error: () => this.error.set('Görev silinemedi.'),
    });
  }

  updateStatus(id: number, status: Task['status']): void {
    this.api.updateTask(id, { status }).subscribe({
      next: (updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? updatedTask : t)));
      },
      error: () => this.error.set('Durum güncellenemedi.'),
    });
  }
}
