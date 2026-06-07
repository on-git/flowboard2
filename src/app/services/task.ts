import { Injectable, signal, computed, effect } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _tasks = signal<Task[]>(this.loadTasks());

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

  constructor() {
    effect(() => {
      localStorage.setItem('flowboard-tasks', JSON.stringify(this._tasks()));
    });
  }

  private loadTasks(): Task[] {
    const stored = localStorage.getItem('flowboard-tasks');
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            title: 'Angular öğren',
            description: 'Signal, NgRx ve performans konularını çalış.',
            status: 'in-progress',
            priority: 'high',
          },
          {
            id: 2,
            title: 'FlowBoard arayüzünü tasarla',
            description: 'Wireframe hazırla ve component yapısını belirle.',
            status: 'todo',
            priority: 'medium',
          },
          {
            id: 3,
            title: 'README yaz',
            description: 'Projeyi dokümante et.',
            status: 'done',
            priority: 'low',
          },
        ];
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
    const newTask: Task = {
      ...task,
      id: Date.now(),
    };
    this._tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(id: number): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  updateStatus(id: number, status: Task['status']): void {
    this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  }
}
