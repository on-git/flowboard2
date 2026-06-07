import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isLoggedIn = signal(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(): void {
    this._isLoggedIn.set(true);
  }

  logout(): void {
    this._isLoggedIn.set(false);
  }
}
