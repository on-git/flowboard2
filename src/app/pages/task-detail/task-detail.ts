import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);

  private readonly taskId = signal<number>(Number(this.route.snapshot.paramMap.get('id')));

  protected readonly task = computed(() =>
    this.taskService.tasks().find((t) => t.id === this.taskId()),
  );

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected updateStatus(status: Task['status']): void {
    this.taskService.updateStatus(this.taskId(), status);
  }
}
