import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from './services/task';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly taskService = inject(TaskService);

  protected readonly title = signal('FlowBoard');
  protected readonly todoCount = this.taskService.todoCount;
  protected readonly inProgressCount = this.taskService.inProgressCount;
  protected readonly doneCount = this.taskService.doneCount;
}
