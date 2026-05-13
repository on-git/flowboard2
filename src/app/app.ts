import { Component, signal, inject } from '@angular/core';
import { TaskCard } from './components/task-card/task-card';
import { Task } from './models/task.model';
import { TaskService } from './services/task';
import { TaskFormComponent } from './components/task-form/task-form';

@Component({
  selector: 'app-root',
  imports: [TaskCard, TaskFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly taskService = inject(TaskService);

  protected readonly title = signal('FlowBoard');
  protected selectedTask = signal<Task | null>(null);

  protected readonly tasks = this.taskService.tasks;
  protected readonly todoCount = this.taskService.todoCount;
  protected readonly inProgressCount = this.taskService.inProgressCount;
  protected readonly doneCount = this.taskService.doneCount;

  protected onTaskSelected(task: Task): void {
    this.selectedTask.set(task);
  }

  protected deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    if (this.selectedTask()?.id === id) {
      this.selectedTask.set(null);
    }
  }

  protected addTask(task: Omit<Task, 'id'>): void {
    this.taskService.addTask(task);
  }

  protected updateStatus(task: { id: number; status: Task['status'] }): void {
    this.taskService.updateStatus(task.id, task.status);
  }
}
