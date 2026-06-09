import { Component, signal, inject, effect } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth';
import {
  selectTodoCount,
  selectInProgressCount,
  selectDoneCount,
} from './store/task/task.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('FlowBoard');
  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly todoCount = this.store.selectSignal(selectTodoCount);
  protected readonly inProgressCount = this.store.selectSignal(selectInProgressCount);
  protected readonly doneCount = this.store.selectSignal(selectDoneCount);

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
