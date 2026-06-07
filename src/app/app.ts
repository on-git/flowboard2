import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TaskService } from './services/task';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('FlowBoard');
  protected readonly todoCount = this.taskService.todoCount;
  protected readonly inProgressCount = this.taskService.inProgressCount;
  protected readonly doneCount = this.taskService.doneCount;
  protected readonly isLoggedIn = this.authService.isLoggedIn;

  constructor() {
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    });
  }

  protected toggleAuth(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    } else {
      this.authService.login();
    }
  }
}
