import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  taskAdded = output<Omit<Task, 'id'>>();

  protected title = signal('');
  protected description = signal('');
  protected priority = signal<Task['priority']>('medium');

  protected onSubmit(): void {
    if (!this.title().trim()) return;

    this.taskAdded.emit({
      title: this.title().trim(),
      description: this.description().trim(),
      status: 'todo',
      priority: this.priority(),
    });

    this.title.set('');
    this.description.set('');
    this.priority.set('medium');
  }
}
