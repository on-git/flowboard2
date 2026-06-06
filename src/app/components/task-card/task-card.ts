import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
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
