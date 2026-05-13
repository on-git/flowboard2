import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _tasks = signal<Task[]>([
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
  ]);

  readonly tasks = this._tasks.asReadonly();

  readonly todoCount = computed(() => this._tasks().filter((t) => t.status === 'todo').length);

  readonly inProgressCount = computed(
    () => this._tasks().filter((t) => t.status === 'in-progress').length,
  );

  readonly doneCount = computed(() => this._tasks().filter((t) => t.status === 'done').length);

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
