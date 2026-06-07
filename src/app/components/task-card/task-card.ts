import { Component, input, output, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  private readonly router = inject(Router);

  task = input.required<Task>();
  isSelected = input<boolean>(false);
  taskSelected = output<Task>();
  taskDeleted = output<number>();
  statusUpdated = output<{ id: number; status: Task['status'] }>();

  onCardClick(): void {
    this.taskSelected.emit(this.task());
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.taskDeleted.emit(this.task().id);
  }

  onStatusChange(event: Event): void {
    event.stopPropagation();
    this.statusUpdated.emit({
      id: this.task().id,
      status: (event.target as HTMLSelectElement).value as Task['status'],
    });
  }

  goToDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/task', this.task().id]);
  }
}
