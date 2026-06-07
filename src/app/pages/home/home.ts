import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
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

  protected selectedTask = signal<Task | null>(null);
  protected readonly tasks = this.taskService.filteredTasks;
  protected readonly filterStatus = this.taskService.filterStatus;
  protected readonly filterPriority = this.taskService.filterPriority;

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
