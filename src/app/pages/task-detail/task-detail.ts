import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);

  private readonly taskId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

  protected readonly isLoading = this.taskService.isLoading;

  protected readonly task = computed(() =>
    this.taskService.tasks().find((t) => t.id === this.taskId()),
  );

  constructor() {
    if (this.taskService.tasks().length === 0) {
      this.taskService.loadTasks();
    }
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected updateStatus(status: Task['status']): void {
    this.taskService.updateStatus(this.taskId(), status);
  }
}
