import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error = signal('');

  error = this._error.asReadonly(); // expose the error signal as a readonly signal to prevent external modification

  showError(message: string) {
    console.log(message);
    this._error.set(message);
  }

  clearError() {
    this._error.set('');
  }
}
